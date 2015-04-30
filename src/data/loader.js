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
        var CACHE_KEYS = {
            RECORDS: 'RECORDS_KEY',
            DATA: 'ORI_DATA'
        };
        /**根据index查找数据*/
        var dataFinder = function(paths, data) {
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
            var record = parseToRecords(data);
            loader._bindCache(CACHE_KEYS.DATA, data);
            loader._bindCache(CACHE_KEYS.DATA, record);
            return record;
        }

        /** ----------------类定义-----------------* */
        var Loader = clz.define({
            name: 'Loader',
            parent: Base,
            proto: {
                load: function() {
                    var me = this,
                        conf = me.getConf();
                    me.fire('beforeload');
                    $.ajax($.extend({}, conf, {
                        success: function(result, textStatus, jqXHR) {
                            var data, rec;
                            if (string.isNotBlank(conf.dataPath)) {
                                data = dataFinder(conf.dataPath
                                    .split('.'), result);
                            } else {
                                data = result;
                            }
                            rec = parseData(me, data);
                            me.fire('load', [rec]);
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
        });

        return register(Loader, {
            loader: 'create'
        })
    });