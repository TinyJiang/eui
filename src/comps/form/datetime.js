'use strict'
define(['eui/utils/utils', 'eui/data/loader', 'eui/base/CompBase', 'eui/core/clz',
    'eui/core/register', 'datetimepicker', 'text!eui/template/form/datetime.html'
], function(utils, loader, CompBase, clz, register, datetimepicker, template) {
    /** ----------------公共参数、方法-----------------* */
    var defaultConf = {
            timeConf: { //时间默认配置
                locale: 'zh-CN',
                format: 'YYYY-MM-DD HH:mm:ss',
                defaultDate: new Date(),
                sideBySide: true,
                showTodayButton: true,
                showClear: true
            },
            useWeek: false, //是否选择week
            startTimePicker: '', //开始时间id(本组件的min值为该组件的值)
            endTimePicker: '', //结束时间id(本组件的max值为该组件的值)
            width: 0
        },
        weekConf = {
            format: 'YYYY-MM-DD 第ww周',
            calendarWeeks: true
        },
        CACHE_KEYS = {

        };

    var initDom = function(_datetime) {
        var d = _datetime.getDom(),
            c = _datetime.getConf(),
            timeConf = c.timeConf;
        d.addClass('input-group date eui-datetime');
        d.append(utils.renderTpl(template, {}));
        if (c.width) {
            d.width(c.width);
        }
        d.datetimepicker(timeConf);
    };

    var getObj = function(_datetime) {
        var d = _datetime.getDom();
        return d.data('DateTimePicker')
    }

    var bindEvents = function(_datetime) {
        var d = _datetime.getDom(),
            c = _datetime.getConf(),
            obj = getObj(_datetime);

        d.on('dp.change', function(e) {
            /**
             * @event change
             * @memberOf datetime
             * @description 选择修改时间触发
             * @param {String} dateString 选中的时间值
             */
            _datetime.fire('change', [e.date]);
            if (utils.string.isNotBlank(c.startTimePicker)) {
                var pickerStart = register.getObj(c.startTimePicker);
                pickerStart.setMax(e.date);
            }

            if (utils.string.isNotBlank(c.endTimePicker)) {
                var pickerEnd = register.getObj(c.endTimePicker);
                pickerEnd.setMin(e.date);
            }
        });
    };

    /** ----------------类定义-----------------* */
    var DateTime = clz.define({
        name: 'DateTime',
        parent: CompBase,
        preConstructor: function(c) {
            // 初始化conf配置
            c.timeConf = c.useWeek ? $.extend({}, defaultConf.timeConf, c.timeConf, weekConf) : $.extend({}, defaultConf.timeConf, c.timeConf);
            c = $.extend({}, defaultConf, c);
            return [c]
        },
        afterConstructor: function() {
            var me = this,
                c = me.getConf();
            initDom(me);
            bindEvents(me);
        },
        proto:
        /** @lends datetime.prototype */
        {
            /**
             * @desc 获取当前值
             * @return {String} 返回日期字符串
             */
            getValue: function() {
                var obj = getObj(this),
                    d = this.getDom();
                return (obj && obj.viewDate) ? obj.viewDate() : d.children('input').val()
            },
            /**
             * @desc 设置值
             * @param {Date | String} v 可为Date或者String类型
             */
            setValue: function(date) {
                var obj = getObj(this);
                return obj && obj.date(date);
            },
            /**
             * @desc 获取原始picker obj，可以使用的方法见see
             * @see http://eonasdan.github.io/bootstrap-datetimepicker/Functions/
             * @return {Object} 原始picker obj
             */
            getObj: function() {
                return getObj(this)
            },
            /**
             * @desc 设置最小值
             * @param {Date | String} v 可为Date或者String类型
             */
            setMin: function(dateString) {
                var me = this;
                dateString = dateString == null ? false : dateString;
                if (me.isInited()) {
                    var obj = getObj(me);
                    obj.minDate(dateString);
                } else {
                    me.on('inited', 'minSetFire', function() {
                        var obj = getObj(this);
                        obj.minDate(dateString);
                        me.off('inited', 'minSetFire');
                    });
                }
            },
            /**
             * @desc 设置最大值
             * @param {Date | String} v 可为Date或者String类型
             */
            setMax: function(dateString) {
                var me = this;
                dateString = dateString == null ? false : dateString;
                if (me.isInited()) {
                    var obj = getObj(me);
                    obj.maxDate(dateString);
                } else {
                    me.on('inited', 'maxSetFire', function() {
                        var obj = getObj(this);
                        obj.maxDate(dateString);
                        me.off('inited', 'maxSetFire');
                    });
                }
            }
        }
    });

    return register(DateTime, {
        /**
         * @constructor datetime
         * @desc 时间选择组件，挂载至eui.datetime
         * @extends CompBase
         * @param {Object} conf 配置对象
         * @param {Object} conf.dom 渲染容器，jquery dom对象
         * @param {Object} conf.timeConf 时间控件配置 见http://eonasdan.github.io/bootstrap-datetimepicker/Options/
         * @param {String} [conf.timeConf.locale='zh-CN'] 语言
         * @param {String} [conf.timeConf.format='YYYY-MM-DD HH:mm:ss'] 格式化样式
         * @param {Date | String} [conf.timeConf.defaultDate=new Date()] 默认时间
         * @param {Boolean} [conf.timeConf.sideBySide=false] 是否日期和时间同时在左右两边显示
         * @param {Boolean} [conf.timeConf.showTodayButton=true] 是否显示选中当前时间按钮
         * @param {Boolean} [conf.timeConf.showClear=false] 是否显示清除按钮
         * @param {Boolean} [conf.useWeek=false] 是否选择星期
         * @param {String} [conf.startTimePicker=''] 开始时间选择组件的id
         * @param {String} [conf.endTimePicker=''] 结束时间选择组件的id
         * @param {Number} [conf.width=0] 宽度
         * @since 0.1
         * @author JJF
         */
        datetime: 'create'
    })
});