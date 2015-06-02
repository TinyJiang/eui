'use strict'
/**
 * @module core/eventful
 * @description 事件驱动组件
 * @since 0.1
 * @author JJF
 */
define(['eui/utils/exception', 'eui/utils/string'], function(e, string) {
    var CACHE_KEYS = {
        EVENT_BIND: '__EVENT_BIND',
        SIZE_KEY: '__size'
    };
    var events_proto = {
        /** 
         * @method on
         * @description 为对象添加事件监听
         * @param {String} eventName 事件名称
         * @param {String} [callbackName=undefined] 回调名称，为空时自动生成一个不重复的名称
         * @param {requestCallback} callback 回调函数
         * @return {Object} 当前对象，支持链式调用
         */

        /**
         * callback 回调函数
         * @callback requestCallback
         * @param {Object[]} arguments fire事件时传入的arguments，各自事件定义
         */
        on: function(event_name, callbackName, callback) {
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
        /** 
         * @method off
         * @description 删除对象事件监听
         * @param {String} eventName 事件名称
         * @param {String} [callbackName=undefined] 回调名称，为空时删除该事件的所有监听
         * @return {Object} 当前对象，支持链式调用
         */
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
        /** 
         * @method fire
         * @description 触发事件监听
         * @param {String} eventName 事件名称
         * @param {String} [callbackName=undefined] 回调名称，为空时触发该事件的所有监听
         * @param {Object[]} [args=undefined] 触发回调函数传入的参数集合
         * @return {Object} 当前对象，支持链式调用
         */
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
        /** 
         * @method _initEvents
         * @private
         * @description 初始化事件，实例化对象时会自动读取events配置，将监听绑定至该对象
         */
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