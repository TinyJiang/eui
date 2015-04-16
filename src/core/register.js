'use strict'
/**
 * 对象注册器 返回create对象方法，并在该方法上绑定register方法供绑定函数参数使用
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
        var regobj = {
            create: function() { // 直接得到对象方法
                return create(clz, arguments);
            }
        };
        if (registerPair) {
            regobj.register = function(proto) { // 注入proto
                for (var i in registerPair) {
                    if (registerPair[i] === 'create') { // create标志符传入create方法
                        registerPair[i] = this.create
                    }
                }
                $.extend(proto, registerPair);
            }
        }
        return regobj
    }
})