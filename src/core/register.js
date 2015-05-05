'use strict'
/**
 * 在类上增加create和register方法
 *
 * @since 0.1
 * @author JJF
 */
define([], function() {
    var instanceNumCache = {}; //缓存instance数目，用于未指定id时生成唯一id

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
        return instance;
    }

    return function(clz, registerPair) {
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
        return clz
    }
})