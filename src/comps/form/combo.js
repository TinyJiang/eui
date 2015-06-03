'use strict'
define(['eui/utils/utils', 'eui/data/loader', 'eui/base/CompBase', 'eui/core/clz',
    'eui/core/register', 'text!eui/template/form/combo.html'
], function(utils, loader, CompBase, clz, register, template) {
    /** ----------------公共参数、方法-----------------* */
    var defaultConf = {
            labelField: '',
            valueField: '',
            value: '',
            multiSel: false,
            width: 0
        },
        CACHE_KEYS = {
            CURRENT_VALUE: 'CURRENT_VALUE'
        };

    var initDom = function(_combo) {
        var d = _combo.getDom(),
            c = _combo.getConf();
        d.addClass('eui-combo');
        if (c.width) {
            d.width(c.width);
        }
    }

    var bindEvents = function(_combo) {
        var d = _combo.getDom(),
            c = _combo.getConf(),
            loader = c.loader;
        loader.on('load', function(records) {
            loader.generateIndex(c.valueField); //根据value建立索引
            renderData(_combo, records);
            if (c.value !== undefined && c.value.length) { //设置默认值
                _combo.setValue(c.value);
            }
        });

        d.find('.dropdown-menu li').on('click', function(e) {
            var me = $(this),
                value = me.attr('data-value');
            tonggleSel(_combo, value);
            if (c.multiSel) {
                return false
            }
        });
    }

    var tonggleSel = function(_combo, v) {
        var vals = _combo._getCache(CACHE_KEYS.CURRENT_VALUE),
            c = _combo.getConf(),
            loader = _combo.getConf().loader,
            _vals = [];
        if (c.multiSel) {
            if (!vals) {
                vals = {};
            }

            if (vals[v] !== undefined) {
                delete(vals[v])
            } else {
                vals[v] = loader.getRecordByIndex(_combo.getConf().valueField, v)
            }

            for (var i in vals) {
                if (vals.hasOwnProperty(i)) {
                    _vals.push(i);
                }
            }
        } else {
            _vals = [v];
        }
        _combo.setValue(_vals);
        /**
         * @event select
         * @memberOf comps.form.Combo
         * @description 选项修改触发
         * @param {String} v 当前修改的v值
         * @param {String[]} vals 修改之后的vals
         */
        _combo.fire('select', [v, _vals]);
    }

    var renderData = function(_combo, records) {
        var d = _combo.getDom(),
            c = _combo.getConf(),
            renderObj = {
                comboid: _combo.getId(),
                multi: c.multiSel ? 'multi' : '',
                list: []
            };

        $.each(records, function(i, rec) {
            renderObj.list.push({
                label: rec.get(c.labelField),
                value: rec.get(c.valueField),
                id: rec.get('id')
            });
        });
        d.empty().append(utils.renderTpl(template, renderObj));
    }


    /** ----------------类定义-----------------* */
    var Combo = clz.define({
        name: 'Combo',
        parent: CompBase,
        preConstructor: function(c) {
            // 初始化conf配置
            c = $.extend({}, defaultConf, c);
            if (!utils.isObjOf(c.loader, loader)) {
                c.loader = loader.create(c.loader);
            }

            return [c]
        },
        afterConstructor: function() {
            var me = this,
                c = me.getConf();
            initDom(me);
            bindEvents(me);
        },
        proto:
        /** @lends comps.form.Combo.prototype */
        {
            /**
             * @desc 获取数据加载器
             * @return {data.Loader}  loader
             */
            getLoader: function() {
                return this.getConf().loader
            },
            /**
             * @desc 设置值
             * @param {String | String[]} v 可为逗号分割的字符串或者值数组
             */
            setValue: function(v) {
                var me = this,
                    d = me.getDom(),
                    c = me.getConf(),
                    loader = c.loader,
                    vals = {},
                    labels = [];
                if ($.type(v) == 'string') {
                    return me.setValue(v.split(','));
                }
                if (v) {
                    var ul = d.find('ul.dropdown-menu');
                    ul.find('li').removeClass('sel');
                    $.each(v, function(i, _v) {
                        var rec = loader.getRecordByIndex(c.valueField, _v);
                        if (rec) {
                            vals[_v] = rec;
                            labels.push(rec.get(c.labelField));
                            $('#' + me.getId() + '-' + rec.get('id')).addClass('sel');
                        }
                    });
                    d.find('#' + me.getId() + '-currentLabel').html(labels.join(','));
                    me._bindCache(CACHE_KEYS.CURRENT_VALUE, vals);
                }
            },
            /**
             * @desc 获取当前值
             * @return {String | String[]} 返回字符串(单选模式)或者字符数组(多选模式)
             */
            getValue: function() {
                var _v = this._getCache(CACHE_KEYS.CURRENT_VALUE),
                    c = this.getConf(),
                    vals = [];

                if (_v) {
                    for (var i in _v) {
                        if (_v.hasOwnProperty(i)) {
                            vals.push(i);
                        }
                    }
                }
                return c.multiSel ? vals : (vals.length ? vals[0] : '')
            },
            /**
             * @desc 获取当前值所在的record
             * @return {data.Record | data.Record[]} 返回record(单选模式)或者record数组(多选模式)
             */
            getRecords: function() {
                var _v = this._getCache(CACHE_KEYS.CURRENT_VALUE),
                    c = this.getConf(),
                    loader = c.loader,
                    vals = [];

                if (_v) {
                    for (var i in _v) {
                        if (_v.hasOwnProperty(i)) {
                            vals.push(_v[i]);
                        }
                    }
                }
                return c.multiSel ? vals : (vals.length ? vals[0] : null)
            }
        }
    });

    return register(Combo, {
        /**
         * @constructor Combo
         * @memberof comps.form
         * @desc COMBO下拉框组件，挂载至eui.combo
         * @extends base.CompBase
         * @param {Object} conf 配置对象
         * @param {Object} conf.dom 渲染容器，jquery dom对象
         * @param {String} conf.labelField label显示列名
         * @param {String} conf.valueField value显示列名
         * @param {String | String[]} [conf.value=''] value值，可为字符串或者数组
         * @param {Boolean} [conf.multiSel=false] 是否多选
         * @param {Number} [conf.width=0] 宽度
         * @since 0.1
         * @author JJF
         */
        combo: 'create'
    })
});