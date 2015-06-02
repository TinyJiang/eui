'use strict'
/**
 * @module utils/utils
 * @description 工具集
 * @since 0.1
 * @author JJF
 */
define(['eui/core/register', 'eui/utils/string'], function(register, string) {
    var utils = {
        string: string,
        /** 
         * @method get
         * @description 根据id获取eui对象
         * @param {String} id 对象id
         * @return {Object}
         */
        get: function(id) {
            return register.getObj(id)
        },
        /** 
         * @method isObjOf
         * @description 判断某个对象是否是某个eui类的对象
         * @param {Object} obj 对象
         * @param {Class} clz eui类
         * @return {Boolean}
         */
        isObjOf: function(obj, clz) { //判断是否符合规范的eui类的的对象
            return obj && $.type(obj.isObjOf) == 'function' && obj.isObjOf(clz)
        },
        /** 
         * @method renderTpl
         * @description 渲染模版
         * @param {Object} tpl html template
         * @param {Object} obj 渲染数据
         * @return {Object} 渲染完成的jquery对象
         */
        renderTpl: function(tpl, obj) {
            return $(Mustache.render(tpl, obj));
        },
        /** 
         * @method isDefined
         * @description 对象是否已声明，总是isUndefined返回相反值
         * @see isUndefined
         * @param {Object} obj 待检测对象
         * @return {Boolean}
         */
        isDefined: function(obj) {
            return !this.isUndefined(obj)
        },
        /** 
         * @method isUndefined
         * @description 对象是否未声明
         * @param {Object} obj 待检测对象
         * @return {Boolean}
         */
        isUndefined: function(obj) {
            return $.type(obj) == 'undefined'
        },
        /** 
         * @method callProto
         * @description 调用prototype中的指定的方法
         * @param {Class} clz 类
         * @param {String} name 方法名
         * @param {Object[]} args 参数
         * @param {Object} scope
         * @return {Boolean}
         */
        callProto: function(clz, name, args, scope) {
            if ($.type(clz) == 'function' && $.type(clz.prototype[name]) == 'function') {
                clz.prototype[name].apply(scope, args);
            }
        }
    };
    return utils
});