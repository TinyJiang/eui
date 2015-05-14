'use strict'
/**
 * 类定义
 *
 * @since 0.1
 * @author JJF
 */
define([], function() {
    var clz = {
        //声明一个类
        //注：name必须唯一
        define: function(conf) {
            var name = conf.name,
                preConstructor = conf.preConstructor,
                parent = conf.parent,
                afterConstructor = conf.afterConstructor,
                proto = conf.proto;
            var C = function() {
                var args = arguments,
                    tmpArgs;
                if (!this._class) {
                    this._class = name;
                }
                if ($.type(preConstructor) == 'function') {
                    tmpArgs = preConstructor.apply(this, args);
                    args = tmpArgs ? tmpArgs : args;
                }
                if ($.type(parent) == 'function') {
                    tmpArgs = parent.apply(this, args);
                    args = tmpArgs ? tmpArgs : args;
                }

                if ($.type(afterConstructor) == 'function') {
                    tmpArgs = afterConstructor.apply(this, args);
                    args = tmpArgs ? tmpArgs : args;
                }
            }

            $.extend(C.prototype, ($.type(parent) == 'function') ? parent.prototype : {}, proto);

            C._class = name;

            return C
        },
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