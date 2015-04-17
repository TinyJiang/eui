'use strict'
/**
 * String 工具类
 *
 * @since 0.1
 * @author JJF
 */
define({
    isNotBlank: function(str) {
        return $.type(str) == 'string' && str.length
    },
    isBlank: function(str) {
        return !this.isNotBlank(str)
    }
});