'use strict'
/**
 * 类定义
 *
 * @since 0.1
 * @author JJF
 */
define([], function() {
    var clz = {
        define: function(conf) {
            var name = conf.name,
                preConstructor = conf.preConstructor,
                parent = conf.parent,
                afterConstructor = conf.afterConstructor,
                proto = conf.proto;
            var C = function() {
                var args = arguments,
                    tmpArgs;
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

                this._class = name;
            }

            $.extend(C.prototype, ($.type(parent) == 'function') ? parent.prototype : {}, proto);

            C._class = name;

            return C
        }
    };

    return clz
});