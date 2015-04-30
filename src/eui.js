/**
 * eui对外对象，所有组件，效果等需要注册在eui对象上的均在此处进行注册
 *
 * @since 0.1
 * @author JJF
 */
define(['eui/comps/grid/grid', 'eui/effects/mask', 'eui/data/loader'], function(grid, mask, loader) {
    var eui = function() {};

    grid.register(eui.prototype);
    mask.register(eui.prototype);
    loader.register(eui.prototype);

    return new eui();
});