'use strict'
/**
 * 时间控件
 *
 * @event init()初始化结束
 * @event change()value修改
 *
 * @since 0.1
 * @author JJF
 */
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
        proto: {
            getValue: function() {
                var obj = getObj(this),
                    d = this.getDom();
                return (obj && obj.viewDate) ? obj.viewDate() : d.children('input').val()
            },
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
        datetime: 'create'
    })
});