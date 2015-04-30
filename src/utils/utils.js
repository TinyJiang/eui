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
        }
    };
    return utils
});