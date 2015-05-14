'use strict'
/**
 * 启用缓存
 *
 * @since 0.1
 * @author JJF
 */
define(['eui/utils/utils'], function(utils) {
    return function(clz) {
        $.extend(clz.prototype, {
            _getCacheObj: function() {
                if (!this.__cache) {
                    this.__cache = {};
                }
                return this.__cache;
            },
            _bindCache: function(type, id, data) {
                var cache = this._getCacheObj()[type];
                if (utils.isUndefined(cache)) {
                    cache = {};
                }
                if (data === undefined) { //2个参数时，id为data，直接把type类型的cache设置为data
                    cache = id;
                } else {
                    cache[id] = data;
                }
                this._getCacheObj()[type] = cache;
            },
            _unbindCache: function(type, id) {
                var cache = this._getCacheObj()[type];
                if (utils.isDefined(cache)) {
                    delete(cache[id])
                }
            },
            _getCache: function(type, id) {
                var cache = this._getCacheObj()[type];
                if (utils.isDefined(cache)) {
                    if (utils.isDefined(id) && id.length) {
                        return cache[id]
                    } else {
                        return cache
                    }
                }
            },
            _clearCache: function(type) {
                var cache = this._getCacheObj();
                if (utils.isDefined(type) && type.length) {
                    cache[type] = {};
                } else {
                    cache = {};
                }
            }
        })
    }
})