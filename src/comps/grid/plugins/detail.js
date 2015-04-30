'use strict'
/**
 * 列插件：用于显示grid的行详情，自动展开grid行
 * @event detailshow
 * @event detailhide
 *
 * @since 0.1
 * @author JJF
 */

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