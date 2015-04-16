'use strict'
define({
    isNotBlank: function(str) {
        return $.type(str) == 'string' && str.length
    },
    isBlank: function(str) {
        return !this.isNotBlank(str)
    }
});