/**
 * eui对外对象，所有组件，效果等需要注册在eui对象上的均在此处进行注册
 *
 * @since 0.1
 * @author JJF
 */
define(['eui/comps/grid/grid', 'eui/comps/tree/tree', 'eui/comps/tree/treenode', 'eui/effects/mask', 'eui/data/loader', 'eui/comps/paging/paging', 'eui/comps/form/combo'],
    function(grid, tree, treenode, mask, loader, paging, combo) {
        var eui = function() {};

        grid.register(eui.prototype);
        mask.register(eui.prototype);
        loader.register(eui.prototype);
        tree.register(eui.prototype);
        treenode.register(eui.prototype);
        paging.register(eui.prototype);
        combo.register(eui.prototype);

        return new eui();
    });