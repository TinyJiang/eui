'use strict'
/**
 * 所有组件基类
 */
define(['eui/core/eventful'], function(eventful) {
    var Base = function() {
        var me = this;
        me._init.apply(this, arguments);
        me._initEvents();
        me.fire('init');
    }

    $.extend(Base.prototype, {
        _init: function(conf) { // 构造函数，需要时重写
            this._bindConf(conf);
        },
        _bindConf: function(conf) {
            this._conf = conf;
            return this
        },
        getConf: function() {
            return this._conf
        },
        _getCacheObj: function() {
            if (!this.__cache) {
                this.__cache = {};
            }
            return this.__cache;
        },
        _bindCache: function(type, id, data) {
            var cache = this._getCacheObj()[type];
            if (!cache) {
                cache = {};
                this._getCacheObj()[type] = cache;
            }
            cache[id] = data;
        },
        _unbindCache: function(type, id) {
            var cache = this._getCacheObj()[type];
            if (cache) {
                delete(cache[id])
            }
        },
        _getCache: function(type, id) {
            var cache = this._getCacheObj()[type];
            if (cache) {
                if (id && id.length) {
                    return cache[id]
                } else {
                    return cache
                }
            }
        },
        _clearCache: function(type) {
            var cache = this._getCacheObj();
            if (type && type.length) {
                cache[type] = {};
            } else {
                cache = {};
            }
        }
    })

    eventful(Base);

    return Base;
});