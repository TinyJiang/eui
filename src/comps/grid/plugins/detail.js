'use strict'
define(['eui/base/UiBase', 'eui/core/clz'], function(clz) {
    var GridDetailPlugin = clz.define({
        name: 'GridDetailPlugin',
        parent: UiBase,
        proto: {}
    });
    return register(GridLineDetail, {
        griddetail: 'create'
    })
});