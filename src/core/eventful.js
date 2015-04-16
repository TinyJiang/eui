'use strict'
/**
 * 事件驱动器
 */
define(['eui/utils/exception', 'eui/utils/string'], function(e, string) {
    var events_proto = {
        on: function(event_name, callback) {
            var me = this;
            if (string.isBlank(event_name)) {
                throw e.throwException('IllegalArgumentException', [
                    'event_name', event_name, 'string'
                ])
            }
            if ($.type(callback) != 'function') {
                throw e.throwException('IllegalArgumentException', [
                    'callback', $.type(callback),
                    'function'
                ])
            }
            if (!me._events) {
                me._events = [];
            }
            if (me._events[event_name]) {
                me._events[event_name].push(callback);
            } else {
                me._events[event_name] = [callback]
            }
            return me
        },
        fire: function(event_name, args) {
            var me = this;
            if (me._events && me._events[event_name]) {
                $.each(me._events[event_name], function(i, event) {
                    event.apply(me, args);
                });
            }
            return me
        },
        _initEvents: function() {
            var me = this,
                c = me.getConf(),
                e;
            if (c && c.events) {
                for (e in c.events) {
                    me.on(e, c.events[e]);
                }
            }
        }
    };

    return function(clz) {
        if ($.type(clz) == 'function') {
            $.extend(clz.prototype, events_proto);
        } else {
            throw e.throwException('IllegalArgumentException', [
                'Class', clz, 'function'
            ])
        }
    }
});