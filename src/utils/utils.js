'use strict'
/**
 * Utils 工具集合
 *
 * @since 0.1
 * @author JJF
 */
define(['eui/core/register', 'eui/utils/string'], function(register, string) {
    var utils = {
        string: string,
        get: function(id) {
            return register.getObj(id)
        },
        isObjOf: function(obj, clz) { //判断是否符合规范的eui类的的对象
            return obj && $.type(obj.isObjOf) == 'function' && obj.isObjOf(clz)
        },
        renderTpl: function(tpl, obj) {
            return $(Mustache.render(tpl, obj));
        },
        isDefined: function(obj) {
            return !this.isUndefined(obj)
        },
        isUndefined: function(obj) {
            return $.type(obj) == 'undefined'
        },
        callProto: function(clz, name, args, scope) {
            if ($.type(clz) == 'function' && $.type(clz.prototype[name]) == 'function') {
                clz.prototype[name].apply(scope, args);
            }
        }
    };
    return utils
});