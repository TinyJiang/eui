'use strict'
/**
 * @module core/register
 * @description eui注册器，可调用该组件往最终的eui对象上绑定特定的方法，如实例化方法等。
 * @since 0.1
 * @author JJF
 */
define([], function() {
    var instanceNumCache = {}; //缓存instance数目，用于未指定id时生成唯一id

    var instanceCache = {}; //根据id缓存所有创建的对象

    /** 
     * @method create
     * @inner
     * @private
     * @description 对象实例化方法(内部函数)
     * @param {Function} clz 类
     * @param {Object[]} [args=undefined] 调用构造函数时传入的参数集合
     * @return {Object}  clz对应的实例化对象
     */
    var create = function(clz, args) {
        function F() {
            var index;
            if (instanceNumCache[clz._class] === undefined) {
                index = 0;
            } else {
                index = instanceNumCache[clz._class] + 1;
            }
            instanceNumCache[clz._class] = index;
            this.__index = index;

            return clz.apply(this, args);
        }
        F.prototype = clz.prototype;

        var instance = new F();
        instanceCache[instance.getId()] = instance;
        return instance;
    }

    /** 
     * @method reg
     * @description 注册器
     * @param {Function} clz 待注册的类
     * @param {Object} [registerPair=undefined] 需要注册的方法集合
     * @param {Function | String} registerPair.x 可自定义添加方法，如果值为create，则自动转为构造函数
     * @return {Function}  clz 类
     */
    var reg = function(clz, registerPair) {
        $.extend(clz, {
            create: function() { // 直接得到对象方法
                return create(clz, arguments);
            },
            register: function(proto) { // 给某个class注入proto
                var me = this;
                for (var i in registerPair) {
                    if (registerPair[i] === 'create') { // create标志符传入create方法
                        registerPair[i] = me.create
                    }
                }
                $.extend(proto, registerPair);
            }
        });

        var oriDestroy = clz.prototype.destroy;

        $.extend(clz.prototype, {
            destroy: function() {
                if (oriDestroy && $.type(oriDestroy) == 'function') {
                    oriDestroy.apply(this);
                }
                delete(instanceCache[this.getId()])
            }
        })
        return clz
    }

    /** 
     * @method getObj
     * @description 根据id获取对象
     * @param {String} id id
     * @return {Object}  对象，找不到时返回undefined
     */
    reg.getObj = function(id) {
        return instanceCache[id]
    }


    return reg
})