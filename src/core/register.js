'use strict'
/**
 * 对象注册器 返回注册方法，用于在eui主对象上注册组件的方法
 *
 * 内置对象
 * create。create对象方法
 *
 * @since 0.1
 * @author JJF
 */
define([], function() {
    var create = function(clz, args) {
        function F() {
            return clz.apply(this, args);
        }
        F.prototype = clz.prototype;
        return new F();
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