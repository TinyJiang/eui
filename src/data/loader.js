'use strict'
define(['eui/utils/exception', 'eui/base/Base', 'eui/core/clz', 'eui/data/record', 'eui/core/register',
        'eui/utils/string'
    ],
    function(e, Base, clz, record, register, string) {
        /** ----------------公共参数,方法-----------------* */
        var defaultConf = {
                autoLoad: false, //自动加载
                local: false, //是否启用本地数据
                localData: {}, //本地数据
                indexBy: [], //索引字段，需要每条数据都是唯一值，如id等
                cacheData: true //是否启用特征缓存
            },
            CACHE_KEYS = {
                RECORDS: 'RECORDS_KEY',
                ORI_DATA: 'ORI_DATA',
                DATA_CACHE: 'DATA_CACHE',
                INDEX_DATA: 'INDEX_DATA'
            };
        /**根据index查找数据*/
        var dataFinder = function(paths, data) {
            if ($.type(data) == 'undefined') {
                return null
            }
            if ($.type(paths) == 'string') {
                paths = paths.split('.')
            }
            if (!paths.length) {
                return data
            }
            var p = paths.shift();
            if (data[p]) {
                return dataFinder(paths, data[p]);
            } else {
                return null
            }
        }

        /**转化为record*/
        var parseToRecords = function(datas) {
            var dataType = $.type(datas),
                _recs;
            if (dataType == 'object') {
                _recs = record.create(datas);
            } else if (dataType == 'array') {
                _recs = [];
                $.each(datas, function(i, data) {
                    _recs.push(record.create(data));
                });
            } else {
                _recs = datas
            }

            return _recs
        }

        /* 转换并绑定数据 */
        var parseData = function(loader, data) {
            var records = parseToRecords(data),
                indexBy = loader.getConf().indexBy;
            loader._bindCache(CACHE_KEYS.RECORDS, records);
            if (indexBy && indexBy.length) { //根据不重复字段建立索引
                $.each(indexBy, function(i, index) {
                    loader.generateIndex(index);
                });

            }
            return records;
        }

        var getCacheKey = function(param) { //获取参数特征
            var keys = [],
                vals = [];
            for (var i in param) {
                if (param.hasOwnProperty(i)) {
                    keys.push(i);
                }
            };

            keys.sort();

            for (var i = keys.length - 1; i >= 0; i--) {
                vals.push(param[keys[i]]);
            };

            return keys.join(',') + vals.join(',')
        }

        var successCall = function(_loader, result) {
            var conf = _loader.getConf(),
                data, rec;
            _loader._bindCache(CACHE_KEYS.ORI_DATA, result);
            if (string.isNotBlank(conf.dataPath)) {
                data = dataFinder(conf.dataPath, result);
            } else {
                data = result;
            }
            rec = parseData(_loader, data);

            /**
             * @event load
             * @memberOf loader
             * @description 数据加载完成之后触发
             * @param {record[]} recs record数据集合
             */
            _loader.fire('load', [rec]);
        };

        /** ----------------类定义-----------------* */
        var Loader = clz.define({
            name: 'Loader',
            parent: Base,
            preConstructor: function(c) {
                c = $.extend({}, defaultConf, c);
                return [c]
            },
            afterConstructor: function(c) {
                var me = this;
                if (c.autoLoad === true) {
                    me.on('eventbind', 'auto_generate', function(eventname, callbacks) {
                        if (eventname == 'load' && callbacks) { //首次绑定load事件的时候再去触发autoload
                            this.load();
                            me.off('eventbind', 'auto_generate'); //触发一次，删除事件
                        }
                    })

                }
                return [c]
            },
            proto:
            /** @lends loader.prototype */
            {
                /** 
                 * @description 加载数据
                 * @fires load
                 * @fires beforeload
                 * @fires loaderror
                 * @param {Object} [params={}] params中指定的参数将会合并至当前参数中发起请求
                 */
                load: function(params) {
                    var me = this,
                        conf = $.extend({}, me.getConf());
                    conf.data = $.extend({}, conf.data, params);
                    /**
                     * @event beforeload
                     * @memberOf loader
                     * @description 数据加载之前触发
                     */
                    me.fire('beforeload');
                    if (conf.local === true) {
                        successCall(me, conf.localData);
                    } else {
                        var cacheKey = getCacheKey(conf.data),
                            dataCache = me._getCache(CACHE_KEYS.DATA_CACHE, cacheKey);
                        if (dataCache) {
                            successCall(me, dataCache);
                        } else {
                            $.ajax($.extend({}, conf, {
                                success: function(result, textStatus, jqXHR) {
                                    if (conf.cacheData) { //开启缓存
                                        me._bindCache(CACHE_KEYS.DATA_CACHE, cacheKey, result);
                                    }
                                    successCall(me, result);

                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    /**
                                     * @event loaderror
                                     * @memberOf loader
                                     * @description 数据加载失败触发
                                     */
                                    me.fire('loaderror', []);
                                    e
                                        .throwException('AjaxException',
                                            arguments);
                                }
                            }));
                        }
                    }
                },
                /** 
                 * @description 获取ajax加载过来的原始数据
                 * @return {Object} 原始数据
                 */
                getOriData: function() {
                    return this._getCache(CACHE_KEYS.ORI_DATA);
                },
                /** 
                 * @description 获取所有records集合
                 * @return {records[]} records集合
                 */
                getRecords: function() {
                    return this._getCache(CACHE_KEYS.RECORDS);
                },
                /** 
                 * @description 制定索引以及key值查找数据，需要预先通过generateIndex建立唯一索引
                 * @see generateIndex
                 */
                getRecordByIndex: function(index, val) { //根据字段以及值查找record，必须是indexBy建立了索引的字段
                    var obj = this._getCache(CACHE_KEYS.INDEX_DATA, index);
                    if (obj) {
                        return obj[val]
                    }
                },
                /** 
                 * @description 通过指定字段名建立索引，字段值必须为非重复值，建立索引之后可根据getRecordByIndex获取数据
                 * @see getRecordByIndex
                 */
                generateIndex: function(index) { //根据字段名称建立索引
                    var records = this.getRecords(),
                        indexObj = {};
                    $.each(records, function(i, rec) {
                        indexObj[rec.get(index)] = rec;
                    });
                    this._bindCache(CACHE_KEYS.INDEX_DATA, index, indexObj);
                },
                /** 
                 * @description 更新ajax参数
                 * @param {Object} param
                 */
                updateParam: function(param) {
                    var me = this,
                        conf = me.getConf();
                    conf.data = $.extend({}, conf.data, param);
                },
                /** 
                 * @description 根据路径寻找节点数据
                 * @param {String} path 数据路径
                 * @return {Object} 找到的数据，找不到则返回undefined
                 */
                findData: function(path) {
                    var oriData = this.getOriData();
                    return dataFinder(path, oriData);
                }
            }
        });

        return register(Loader, {
            /** 
             * @constructor loader
             * @desc 数据加载器，挂载至eui.loader(conf)
             * @extends Base
             * @see record
             * @since 0.1
             * @author JJF
             * @param {Object} conf
             * @param {Boolean} [conf.autoLoad=false] 是否自动加载
             * @param {Boolean} [conf.local=false] 是否启用本地数据，启用时将不通过ajax加载
             * @param {Object[]} [conf.localData=[]] 本地数据集合，local = true时生效
             * @param {String[]} [conf.indexBy=[]] 索引字段集合，建立过索引的字段可以通过value直接获取record
             * @param {Boolean} [conf.cacheData=true] 是否开启数据缓存，开启之后加载过的页面将不会再通过请求去加载
             */
            loader: 'create'
        })
    });