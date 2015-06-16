'use strict'
define(['eui/utils/utils', 'eui/data/loader', 'eui/base/CompBase', 'eui/core/clz',
    'eui/core/register', 'eui/comps/form/condition', 'text!eui/template/form/conditiongroup.html'
], function(utils, loader, CompBase, clz, register, condition, template) {
    /** ----------------公共参数、方法-----------------* */
    var defaultConf = {
            conditions: [],
            showSlide: true
        },
        CACHE_KEYS = {
            CONDITIONOBJS: 'CONDITIONOBJS'
        };

    var initDom = function(_group) {
        var d = _group.getDom();
        d.addClass('eui-condition-group');
    }

    var renderConditions = function(_group) {
        var d = _group.getDom(),
            c = _group.getConf(),
            conditions = c.conditions,
            renderObj = {
                showSlide: c.showSlide ? '' : 'hide',
                conditions: []
            };
        $.each(conditions, function(i, c) {
            var id = _group.getId() + '-' + c.name + '-cnt';
            renderObj.conditions.push({
                id: id
            });
        });
        d.empty().append(utils.renderTpl(template, renderObj));
        $.each(conditions, function(i, c) {
            var id = _group.getId() + '-' + c.name;
            var obj = condition.create($.extend({}, c, {
                id: id,
                dom: $('#' + id + '-cnt'),
                events: {
                    select: function(v, rec, e) {
                        /**
                         * @event select
                         * @memberOf comps.form.ConditionGroup
                         * @description 选中选项
                         * @param {String} name 分组名称
                         * @param {String} val 当前选中的值
                         * @param {data.Record} record 当前选中的record
                         * @param {EventObject} e 事件对象
                         */
                        _group.fire('select', [c.name, v, rec, e]);
                    },
                    unselect: function(v, rec, e) {
                        /**
                         * @event select
                         * @memberOf comps.form.ConditionGroup
                         * @description 选中选项
                         * @param {String} name 分组名称
                         * @param {String} val 当前选中的值
                         * @param {data.Record} record 当前选中的record
                         * @param {EventObject} e 事件对象
                         */
                        _group.fire('unselect', [c.name, v, rec, e]);
                    }
                }
            }));
            _group._bindCache(CACHE_KEYS.CONDITIONOBJS, c.name, obj);
        });
    }

    var bindEvents = function(_group) {
        var d = _group.getDom();
        d.on('click', 'button', function(e) {
            var me = $(this);
            if (me.hasClass('expand-btn')) {
                _group.expand();
            } else {
                _group.collapse();
            }
        });
    }


    /** ----------------类定义-----------------* */
    var ConditionGroup = clz.define({
        name: 'ConditionGroup',
        parent: CompBase,
        preConstructor: function(c) {
            // 初始化conf配置
            c = $.extend({}, defaultConf, c);

            return [c]
        },
        afterConstructor: function() {
            var me = this,
                c = me.getConf();
            initDom(me);
            bindEvents(me);
            renderConditions(me);
        },
        proto:
        /** @lends comps.form.ConditionGroup.prototype */
        {
            /**
             * @desc 设置值
             * @param {Object} kvPair
             * @param {String} kvPair.name 分组名称
             * @param {String | String[]} kvPair.value 分组值
             */
            setValue: function(kvPair) {
                var me = this;
                if (kvPair) {
                    for (var i in kvPair) {
                        if (kvPair.hasOwnProperty(i)) {
                            var obj = me.getCondition(i);
                            if (obj) {
                                obj.setValue(kvPair[i]);
                            }
                        }
                    }
                }
            },
            /**
             * @desc 获取当前值
             * @return {Object} kvPair
             */
            getValue: function() {
                var objs = this._getCache(CACHE_KEYS.CONDITIONOBJS),
                    rs = {};
                if (objs) {
                    for (var i in objs) {
                        if (objs.hasOwnProperty(i)) {
                            rs[i] = objs[i].getValue();
                        }
                    }
                }
                return rs;
            },
            /**
             * @desc 获取当前值所在的record
             * @return {Object} kvPair
             */
            getRecords: function() {
                var objs = this._getCache(CACHE_KEYS.CONDITIONOBJS),
                    rs = {};
                if (objs) {
                    for (var i in objs) {
                        if (objs.hasOwnProperty(i)) {
                            rs[i] = objs[i].getRecords();
                        }
                    }
                }
                return rs;
            },
            /**
             * @desc 展开面板
             */
            expand: function() {
                var me = this,
                    d = me.getDom(),
                    cnt = d.find('.eui-condition-group-inner-cnt');
                d.removeClass('eui-condition-group-collapsed');
                cnt.stop().slideDown(300, function() {});
                /**
                 * @event expand
                 * @memberOf comps.form.ConditionGroup
                 * @description 展开面板
                 */
                me.fire('expand', [])
                return me
            },
            /**
             * @desc 收缩面板
             */
            collapse: function() {
                var me = this,
                    d = me.getDom(),
                    cnt = d.find('.eui-condition-group-inner-cnt');
                cnt.stop().slideUp(300, function() {
                    d.addClass('eui-condition-group-collapsed');
                });
                /**
                 * @event collapse
                 * @memberOf comps.form.ConditionGroup
                 * @description 收缩面板
                 */
                me.fire('collapse', [])
                return me
            },
            /**
             * @desc 设置禁用状态
             * @param {String} name 分组名称
             * @param {Boolean} isDisabled 是否禁用
             */
            setDisabled: function(name, isDisabled) {
                var obj = this.getCondition(name);
                if (obj) {
                    obj.setDisabled(isDisabled);
                }
            },
            /**
             * @desc 是否被禁用
             * @param {String} name 分组名称
             * @return {Boolean}
             */
            isDisabled: function(name) {
                var obj = this.getCondition(name);
                if (obj) {
                    return obj.isDisabled()
                }
            },
            /**
             * @desc 获取组件对象
             * @return {comps.form.Condition}
             */
            getCondition: function(name) {
                return this._getCache(CACHE_KEYS.CONDITIONOBJS, name);
            }
        }
    });

    return register(ConditionGroup, {
        /**
         * @constructor ConditionGroup
         * @memberof comps.form
         * @desc 条件选择组件集合面板，挂载至eui.conditiongroup
         * @extends base.CompBase
         * @param {Object} conf 配置对象
         * @param {Object} conf.dom 渲染容器，jquery dom对象
         * @param {Boolean} [conf.showSlide=true] 是否显示展开收缩按钮
         * @param {comps.form.Condition[]} conf.conditions 选择组件配置(务必配置name，作为数据名称!!)
         * @since 0.1
         * @author JJF
         */
        conditiongroup: 'create'
    })
});