'use strict'
/**
 * 数据加载器
 *
 * conf:jquery ajax所有参数 (dataPath:String 数据路径)
 * @event load 加载数据完成之后触发
 * @event loaderror 加载数据失败触发
 *
 * @since 0.1
 * @author JJF
 */
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
            proto: {
                load: function(params) {
                    var me = this,
                        conf = $.extend({}, me.getConf());
                    conf.data = $.extend({}, conf.data, params);
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
                                    me.fire('loaderror', []);
                                    e
                                        .throwException('AjaxException',
                                            arguments);
                                }
                            }));
                        }
                    }
                },
                getOriData: function() {
                    return this._getCache(CACHE_KEYS.ORI_DATA);
                },
                getRecords: function() {
                    return this._getCache(CACHE_KEYS.RECORDS);
                },
                getRecordByIndex: function(index, val) { //根据字段以及值查找record，必须是indexBy建立了索引的字段
                    var obj = this._getCache(CACHE_KEYS.INDEX_DATA, index);
                    if (obj) {
                        return obj[val]
                    }
                },
                generateIndex: function(index) { //根据字段名称建立索引
                    var records = this.getRecords(),
                        indexObj = {};
                    $.each(records, function(i, rec) {
                        indexObj[rec.get(index)] = rec;
                    });
                    this._bindCache(CACHE_KEYS.INDEX_DATA, index, indexObj);
                },
                updateParam: function(param) {
                    var me = this,
                        conf = me.getConf();
                    conf.data = $.extend({}, conf.data, param);
                },
                findData: function(path) {
                    var oriData = this.getOriData();
                    return dataFinder(path, oriData);
                }
            }
        });

        return register(Loader, {
            loader: 'create'
        })
    });