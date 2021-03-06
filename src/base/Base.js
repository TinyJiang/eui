'use strict'
/**
 * @class Base
 * @memberof base
 * @description 所有类的基类，自动对所有类添加cache特性以及eventful特性，所有类里都将会有这两个feature中的所有方法
 * @see cache
 * @see eventful
 * @since 0.1
 * @author JJF
 */
define(['eui/core/clz', 'eui/utils/utils', 'eui/core/eventful', 'eui/core/cache'],
    function(clz, utils, eventful, cache) {
        var Base = clz.define({
            name: 'Base',
            /** 
             * @memberOf base.Base
             * @private
             * @method preConstructor
             * @description 构造方法，父类构造方法执行之前调用
             * @fires init
             */
            preConstructor: function(c) {
                var me = this;
                me._bindConf(c);
                me._initId();
                me._initEvents();
                /**
                 * @event init
                 * @memberOf base.Base
                 * @description 初始化开始时触发
                 */
                me.fire('init');
                return [c]
            },
            /** 
             * @memberOf base.Base
             * @private
             * @method afterConstructor
             * @description 构造方法，父类构造方法执行之后调用
             * @fires inited
             */
            afterConstructor: function(c) {
                this._bindCache('__inited', true);

                /**
                 * @event inited
                 * @memberOf base.Base
                 * @description 初始化结束时触发
                 */
                this.fire('inited');
                return [c]
            },
            proto:
            /** @lends base.Base.prototype */
            {
                /** 
                 * @private
                 * @description 绑定配置
                 */
                _bindConf: function(conf) {
                    this._conf = conf;
                    return this
                },
                /** 
                 * @description 获取配置
                 * @return {Object} 用户传入的config配置对象
                 */
                getConf: function() {
                    return this._conf
                },
                /** 
                 * @private
                 * @description 初始化id
                 * @return {String} id
                 */
                _initId: function() {
                    var conf = this.getConf(),
                        id = conf.id,
                        index = this.__index;
                    id = (id === undefined || id == '') ? (this._class + index) : id;
                    conf.id = id;
                    return id
                },
                /** 
                 * @description 是否已初始化完成
                 * @return {Boolean}
                 */
                isInited: function() {
                    return !!this._getCache('__inited')
                },
                /** 
                 * @description 获取id
                 * @return {String} id
                 */
                getId: function() {
                    return this.getConf().id;
                },
                /** 
                 * @description 判断当前对象是否是某个eui类的对象
                 * @param {Class} clz eui类
                 * @return {Boolean}
                 */
                isObjOf: function(clz) {
                    return this.constructor._class == clz._class //鸭子比较－ －
                },
                /** 
                 * @description 销毁对象
                 */
                destroy: function() {
                    this._bindCache('destroyed', true);
                },
                /** 
                 * @description 判断该对象是否已被销毁
                 * @return {Boolean}
                 */
                isDestroyed: function() {
                    return !!this._getCache('destroyed')
                }
            }
        });

        cache(Base);
        eventful(Base);

        return Base;
    });