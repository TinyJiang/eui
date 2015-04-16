'use strict'
define([], function() {
    var mask = function(dom, text) {}

    var loadmask = function(dom) {}

    var unmask = function(dom) {}

    return {
        mask: mask,
        loadmask: loadmask,
        unmask: unmask,
        register: function(obj) {
            $.extend(obj, {
                mask: mask,
                loadmask: loadmask,
                unmask: unmask
            });
        }
    }
})