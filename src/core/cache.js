'use strict'
/**
 * @module cache
 * @memberof core
 * @description 缓存组件，调用组件会在Class.prototype上注入缓存调用方法
 * @since 0.1
 * @author JJF
 */
define(['eui/utils/utils'], function(utils) {
    var fn = function(clz) {
        $.extend(clz.prototype, {
            /** 
             * @method _getCacheObj
             * @description 获取缓存介质对象，找不到时返回空对象
             * @return {Object} 缓存介质对象
             */
            _getCacheObj: function() {
                if (!this.__cache) {
                    this.__cache = {};
                }
                return this.__cache;
            },
            /** 
             * @method _bindCache
             * @description 绑定缓存
             * @param {String} type 缓存类型key
             * @param {String} [id=undefined] id为空时用data替换为整个类型的值
             * @param {Object}  data 缓存数据
             */
            _bindCache: function(type, id, data) {
                var cache = this._getCacheObj()[type];
                cache = utils.isUndefined(cache) ? {} : cache;
                if (data === undefined) { //2个参数时，id为data，直接把type类型的cache设置为data
                    cache = id;
                } else {
                    cache[id] = data;
                }
                this._getCacheObj()[type] = cache;
            },
            /** 
             * @method _unbindCache
             * @description 释放绑定缓存
             * @param {String} type 缓存类型key
             * @param {String} [id=undefined] id为空时释放整个类型的缓存，否则只释放ID为key对应的缓存数据
             */
            _unbindCache: function(type, id) {
                var cache = this._getCacheObj()[type];
                if (utils.isDefined(cache)) {
                    delete(cache[id])
                }
            },
            /** 
             * @method _getCache
             * @description 获取缓存数据
             * @param {String} type 缓存类型key
             * @param {String} [id=undefined] id为空返回整个类型的缓存，否则只返回ID为key对应的缓存数据
             * @return {Object} 对应的缓存数据，未找到则返回undefined
             */
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
            /** 
             * @method _clearCache
             * @description 清理单类型缓存数据
             * @param {String} type 缓存类型key
             * @see _unbindCache
             */
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
    return fn;
})