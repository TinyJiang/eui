'use strict'
/**
 * COMBO下拉框组件
 *
 * @event init()初始化结束
 * @event expand()打开下拉
 * @event collapse()收起下拉
 * @event select(records)选中
 *
 * @since 0.1
 * @author JJF
 */
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
        proto: {
            getLoader: function() {
                return this.getConf().loader
            },
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
        combo: 'create'
    })
});