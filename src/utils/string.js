'use strict'
/**
 * @module utils/string
 * @description string工具集
 * @since 0.1
 * @author JJF
 */
define({
    /** 
     * @description 是否非空字符串，传入非字符串也会反悔false
     * @return {Boolean}
     */
    isNotBlank: function(str) {
        return $.type(str) == 'string' && str.length
    },
    /** 
     * @description 是否空字符串，总是返回isNotBlank的相反结果
     * @return {Boolean}
     * @see isNotBlank
     */
    isBlank: function(str) {
        return !this.isNotBlank(str)
    }
});