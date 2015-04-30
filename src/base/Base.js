'use strict'
/**
 * 所有类的基类
 * 实例化对象时自动执行_init方法(fire init 事件)，将构造参数会全部传过去
 *
 * @since 0.1
 * @author JJF
 */
define(['eui/core/clz', 'eui/core/eventful'], function(clz, eventful) {
    var Base = clz.define({
        name: 'Base',
        preConstructor: function(conf) {
            var me = this;
            me._bindConf(conf);
            me._initEvents();
            me.fire('init');
        },
        proto: {
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
        }
    });

    eventful(Base);

    return Base;
});