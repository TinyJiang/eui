'use strict'
/**
 * Utils 工具集合
 *
 * @since 0.1
 * @author JJF
 */
define([], function() {
    var utils = {
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
        }
    };
    return utils
});