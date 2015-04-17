'use strict'
/**
 * 控制dom mask效果(未完成)
 *
 * @since 0.1
 * @author JJF
 */

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