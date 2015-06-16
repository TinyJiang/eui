'use strict'
define(['eui/utils/utils', 'eui/data/loader', 'eui/base/CompBase', 'eui/core/clz',
    'eui/core/register', 'text!eui/template/form/condition.html'
], function(utils, loader, CompBase, clz, register, template) {
    /** ----------------公共参数、方法-----------------* */
    var defaultConf = {
            labelField: 'label',
            valueField: 'value',
            value: '',
            label: '',
            labelAlign: 'right',
            labelWidth: 80,
            node: '',
            dataMode: 'commondata', //commondata or local
            localData: {},
            loader: undefined,
            allFlag: false,
            showMore: false,
            disabled: false,
            multiSel: false,
            fixedHeight: false
        },
        CACHE_KEYS = {
            DISABLED: 'DISABLED'
        };

    var initDom = function(_condition) {
        var d = _condition.getDom(),
            c = _condition.getConf();
        d.addClass('eui-condition');
        _condition.setDisabled(c.disabled);
    }

    var renderData = function(_condition, records) {
        var d = _condition.getDom(),
            c = _condition.getConf(),
            renderObj = {
                label: c.label,
                fixedHeight: c.fixedHeight ? 'fixedHeight' : '',
                showMore: c.showMore ? '' : 'hide',
                datas: [],
                labelWidth: c.labelWidth,
                labelAlign: c.labelAlign
            };

        $.each(records, function(i, rec) {
            var v = rec.get(c.valueField);
            renderObj.datas.push({
                label: rec.get(c.labelField),
                value: v,
                isAll: v == '_ALL_' ? 'all' : '',
                id: generateCdtId(_condition, v)
            });
        });
        d.empty().append(utils.renderTpl(template, renderObj));
    }

    var generateCdtId = function(_condition, value) {
        return _condition.getId() + '-cdt-' + value
    }

    var bindEvents = function(_condition) {
        var d = _condition.getDom(),
            c = _condition.getConf(),
            loader = c.loader;

        loader.on('load', function(records) {
            loader.generateIndex(c.valueField);
            renderData(_condition, records);
            if (c.value !== undefined && c.value.length) { //设置默认值
                _condition.setValue(c.value);
            }
        });

        d.on('click', '.condition', function(e) {
            if (_condition.isDisabled()) {
                return
            }
            var me = $(this),
                val = me.attr('data-value'),
                record = loader.getRecordByIndex(c.valueField, val);
            if (c.multiSel) {
                if (val == '_ALL_') {
                    d.find('.condition').removeClass('sel');
                    me.addClass('sel');
                    /**
                     * @event select
                     * @memberOf comps.form.Condition
                     * @description 选中选项
                     * @param {String} val 当前选中的值
                     * @param {data.Record} record 当前选中的record
                     * @param {EventObject} e 事件对象
                     */
                    _condition.fire('select', [val, record, e]);
                } else {
                    if (me.hasClass('sel')) {
                        me.removeClass('sel')
                        /**
                         * @event unselect
                         * @memberOf comps.form.Condition
                         * @description 取消选中
                         * @param {String} val 当前取消选中的值
                         * @param {data.Record} record 当前选中的record
                         * @param {EventObject} e 事件对象
                         */
                        _condition.fire('unselect', [val, record, e]);
                    } else {
                        me.addClass('sel')
                        _condition.fire('select', [val, record, e]);
                        d.find('.all').removeClass('sel');
                    }
                }
            } else {
                d.find('.condition').removeClass('sel');
                me.addClass('sel');
                _condition.fire('select', [val, record, e]);
            }
        });

        d.on('click', '.glyphicon', function() {
            if (_condition.isDisabled()) {
                return
            }
            var me = $(this);
            if (me.hasClass('glyphicon-chevron-down')) {
                me.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
                d.children('table').removeClass('fixedHeight')
            } else {
                me.removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down')
                d.children('table').addClass('fixedHeight')
            }
        });
    }


    /** ----------------类定义-----------------* */
    var Condition = clz.define({
        name: 'Condition',
        parent: CompBase,
        preConstructor: function(c) {
            // 初始化conf配置
            c = $.extend({}, defaultConf, c);
            if (!c.fixedHeight) {
                c.showMore = false;
            }
            if (!c.loader) {
                c.loader = loader.create({
                    url: eastcom.baseURL + '/common/loadCommonDatas',
                    local: c.dataMode === 'local',
                    data: {
                        allFlag: c.allFlag
                    },
                    localData: c.localData
                });
            }

            return [c]
        },
        afterConstructor: function() {
            var me = this,
                c = me.getConf();
            initDom(me);
            bindEvents(me);
            c.loader.load();
        },
        proto:
        /** @lends comps.form.Condition.prototype */
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
                    d.find('span.sel').removeClass('sel');
                    $.each(v, function(i, _v) {
                        $('#' + generateCdtId(me, _v)).addClass('sel')
                    });
                }
            },
            /**
             * @desc 获取当前值
             * @return {String | String[]} 返回字符串(单选模式)或者字符数组(多选模式)
             */
            getValue: function() {
                var me = this,
                    vals = [],
                    c = me.getConf(),
                    d = me.getDom(),
                    sels = d.find('span.sel');

                $.each(sels, function(i, sel) {
                    vals.push($(sel).attr('data-value'));
                });
                return c.multiSel ? vals : (vals.length ? vals[0] : '')
            },
            /**
             * @desc 获取当前值所在的record
             * @return {data.Record | data.Record[]} 返回record(单选模式)或者record数组(多选模式)
             */
            getRecords: function() {
                var me = this,
                    vals = me.getValue(),
                    c = me.getConf(),
                    loader = c.loader,
                    recs = [];
                if (c.multiSel) {
                    $.each(vals, function(i, v) {
                        recs.push(loader.getRecordByIndex(c.valueField, v));
                    });
                    return recs
                } else {
                    return loader.getRecordByIndex(c.valueField, vals)
                }
            },
            /**
             * @desc 设置禁用状态
             * @param {Boolean} isDisabled 是否禁用
             */
            setDisabled: function(isDisabled) {
                var me = this,
                    d = me.getDom();
                isDisabled = !!isDisabled;

                if (isDisabled != me.isDisabled()) {
                    if (isDisabled) {
                        d.addClass('eui-condition-disabled');
                    } else {
                        d.removeClass('eui-condition-disabled');
                    }
                    this._bindCache(CACHE_KEYS.DISABLED, isDisabled);
                }
            },
            /**
             * @desc 是否被禁用
             * @return {Boolean}
             */
            isDisabled: function() {
                return !!this._getCache(CACHE_KEYS.DISABLED)
            }
        }
    });

    return register(Condition, {
        /**
         * @constructor Condition
         * @memberof comps.form
         * @desc 条件选择组件，挂载至eui.condition
         * @extends base.CompBase
         * @param {Object} conf 配置对象
         * @param {Object} conf.dom 渲染容器，jquery dom对象
         * @param {String} conf.labelField label显示列名
         * @param {String} conf.valueField value显示列名
         * @param {String | String[]} [conf.value=''] value值，可为字符串或者数组
         * @param {Boolean} [conf.multiSel=false] 是否多选
         * @param {String} [conf.labelAlign='right'] label对齐方向
         * @param {Number} [conf.labelWidth=80] label宽度
         * @param {String} [conf.node=''] 使用commondata时父节点名称
         * @param {String} [conf.dataMode='commondata'] commondata:基础数据，local:本地数据
         * @param {Object} [conf.localData={}] local时的本地数据
         * @param {Boolean} [conf.allFlag=false] 是否显示全选
         * @param {data.Loader} [conf.loader=null] 自定义数据加载器
         * @param {Boolean} [conf.showMore=false] 是否显示更多按钮
         * @param {Boolean} [conf.disabled=false] 是否禁用
         * @param {Boolean} [conf.multiSel=false] 是否允许多选
         * @param {fixedHeight} [conf.fixedHeight=false] 是否固定高度，不固定高度将会显示所有带选项，固定则只显示一行，通过更多按钮展开
         
         * @since 0.1
         * @author JJF
         */
        condition: 'create'
    })
});