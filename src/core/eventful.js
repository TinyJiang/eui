'use strict'
/**
 * 事件驱动器(默认所有组件均加载事件驱动)
 *
 * @since 0.1
 * @author JJF
 */
define(['eui/utils/exception', 'eui/utils/string'], function(e, string) {
    var CACHE_KEYS = {
        EVENT_BIND: '__EVENT_BIND',
        SIZE_KEY: '__size'
    };
    var events_proto = {
        on: function(event_name, callbackName, /*可选参数*/ callback) {
            var me = this,
                autoCallbackName = false; //自动生成名称
            if (!callback) {
                callback = callbackName;
                autoCallbackName = true;
            }

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

            var events = me._getCache(CACHE_KEYS.EVENT_BIND, event_name);

            if (!events) {
                events = {};
                events[CACHE_KEYS.SIZE_KEY] = 0;
            }

            if (autoCallbackName) {
                callbackName = 'event_' + (events[CACHE_KEYS.SIZE_KEY] + 1);
            }
            if (!events[callbackName]) {
                events[CACHE_KEYS.SIZE_KEY] = events[CACHE_KEYS.SIZE_KEY] + 1;
            }
            events[callbackName] = callback;

            me._bindCache(CACHE_KEYS.EVENT_BIND, event_name, events);


            if (event_name !== 'eventbind') {
                me.fire('eventbind', [event_name, events]);
            }
            return me
        },
        off: function(event_name, callbackName) {
            var me = this,
                events = me._getCache(CACHE_KEYS.EVENT_BIND, event_name);
            if (!events) {
                return me
            }
            if (callbackName && callbackName.length) {
                if (events[callbackName]) {
                    events[CACHE_KEYS.SIZE_KEY] = events[CACHE_KEYS.SIZE_KEY] - 1;
                    delete(events[callbackName]);
                    me._bindCache(CACHE_KEYS.EVENT_BIND, event_name, events)
                }
            } else {
                me._unbindCache(CACHE_KEYS.EVENT_BIND, event_name);
            }
            return me
        },
        fire: function(event_name, callbackName, /*可选参数*/ args) {
            var me = this,
                events = me._getCache(CACHE_KEYS.EVENT_BIND, event_name),
                callbacks = [];
            if (!events) {
                return me
            }
            if ($.type(callbackName) == 'string' && callbackName.length) {
                callbacks.push(events[callbackName]);
            } else {
                args = callbackName;
                for (var i in events) {
                    if (events.hasOwnProperty(i) && i != CACHE_KEYS.SIZE_KEY) {
                        callbacks.push(events[i]);
                    }
                }
            }

            $.each(callbacks, function(i, callback) {
                callback.apply(me, args);
            });

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