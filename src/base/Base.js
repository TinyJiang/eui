'use strict'
/**
 * 所有类的基类
 * 实例化对象时自动执行_init方法(fire init 事件)，将构造参数会全部传过去
 *
 * @since 0.1
 * @author JJF
 */
define(['eui/core/clz', 'eui/utils/utils', 'eui/core/eventful', 'eui/core/cache'],
    function(clz, utils, eventful, cache) {
        var Base = clz.define({
            name: 'Base',
            preConstructor: function(c) {
                var me = this;
                me._bindConf(c);
                me._initId();
                me._initEvents();
                me.fire('init');
                return [c]
            },
            afterConstructor: function(c) {
                this._bindCache('__inited', true);
                this.fire('inited');
                return [c]
            },
            proto: {
                _bindConf: function(conf) {
                    this._conf = conf;
                    return this
                },
                getConf: function() {
                    return this._conf
                },
                _initId: function() {
                    var conf = this.getConf(),
                        id = conf.id,
                        index = this.__index;
                    id = (id === undefined || id == '') ? (this._class + index) : id;
                    conf.id = id;
                    return id
                },
                isInited: function() {
                    return !!this._getCache('__inited')
                },
                getId: function() {
                    return this.getConf().id;
                },
                isObjOf: function(clz) {
                    return this.constructor._class == clz._class //鸭子比较－ －
                },
                destroy: function() {
                    console.log(2)
                    this._bindCache('destroyed', true);
                },
                isDestroyed: function() {
                    return !!this._getCache('destroyed')
                }
            }
        });

        cache(Base);
        eventful(Base);

        return Base;
    });