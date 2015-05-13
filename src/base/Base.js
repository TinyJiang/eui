'use strict'
/**
 * 所有类的基类
 * 实例化对象时自动执行_init方法(fire init 事件)，将构造参数会全部传过去
 *
 * @since 0.1
 * @author JJF
 */
define(['eui/core/clz', 'eui/utils/utils', 'eui/core/eventful'], function(clz, utils, eventful) {
    var Base = clz.define({
        name: 'Base',
        preConstructor: function(conf) {
            var me = this;
            me._bindConf(conf);
            me._initId();
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
            },
            _initId: function() {
                var conf = this.getConf(),
                    id = conf.id,
                    index = this.__index;
                id = (id === undefined || id == '') ? (this._class + index) : id;
                conf.id = id;
                return id
            },
            getId: function() {
                return this.getConf().id;
            },
            isObjOf: function(clz) {
                return this.constructor._class == clz._class //鸭子比较－ －
            }
        }
    });

    eventful(Base);

    return Base;
});