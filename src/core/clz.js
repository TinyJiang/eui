'use strict'
/**
 * @module core/clz
 * @description oop组件，定义类，关键为实现继承功能
 * @since 0.1
 * @author JJF
 */
define([], function() {
    var clz = {
        /** 
         * @method define
         * @public
         * @description 定义类,参数通过conf对象传输
         * @param {Object} conf 类配置
         * @param {String} conf.name 类名
         * @param {Function} [conf.parent=undefined] 父类
         * @param {Function} conf.preConstructor 前置构造函数(参数为用户实例化对象时的arguments，也必须return arguments给下一个构造函数使用)
         * @param {Function} conf.afterConstructor 后置构造函数(参数为用户实例化对象时的arguments，也必须return arguments给下一个构造函数使用)
         * @param {Object} conf.proto 注入prototype的方法集
         * @return {Function} 类
         */
        define: function(conf) {
            var name = conf.name,
                preConstructor = conf.preConstructor,
                parent = conf.parent,
                afterConstructor = conf.afterConstructor,
                proto = conf.proto;
            var C = function() {
                var args = arguments,
                    me = this,
                    tmpArgs;
                if (!me._class) {
                    me._class = name;
                }
                if ($.type(preConstructor) == 'function') {
                    tmpArgs = preConstructor.apply(me, args);
                    args = tmpArgs ? tmpArgs : args;
                }
                if ($.type(parent) == 'function') {
                    tmpArgs = parent.apply(me, args);
                    args = tmpArgs ? tmpArgs : args;
                }

                if ($.type(afterConstructor) == 'function') {
                    tmpArgs = afterConstructor.apply(me, args);
                    args = tmpArgs ? tmpArgs : args;
                }
            }

            $.extend(C.prototype, ($.type(parent) == 'function') ? parent.prototype : {}, proto);

            C._class = name;
            C._parent = parent;

            return C
        },
        /** 
         * @method clone
         * @public
         * @deprecated 请使用$.extend
         * @description 复制对象
         * @param {Object} obj 对象
         * @param {Object} extensionConf 扩展属性
         * @return {Object} 新对象
         */
        clone: function(obj, extensionConf) {
            var o;
            if (obj) {
                o = obj.constructor.create($.extend({}, obj.getConf(), extensionConf));
            }
            return o
        }
    };

    return clz
});