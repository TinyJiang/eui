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
        /** ----------------公共方法-----------------* */
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
                            var data;
                            if (string.isNotBlank(conf.dataPath)) {
                                data = dataFinder(conf.dataPath
                                    .split('.'), result);
                            } else {
                                data = result;
                            }
                            me.fire('load', [data]);
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