/**
 * eui对外对象，所有组件，效果等需要注册在eui对象上的均在此处进行注册
 *
 * @since 0.1
 * @author JJF
 */
define(['eui/utils/utils',
        'eui/comps/grid/grid',
        'eui/comps/grid/plugins/editor',
        'eui/comps/tree/tree',
        'eui/comps/tree/treenode',
        'eui/effects/mask',
        'eui/data/loader',
        'eui/comps/paging/paging',
        'eui/comps/form/combo',
        'eui/comps/form/datetime',
        'eui/comps/form/condition',
        'eui/comps/form/conditiongroup',
        'eui/comps/window/window',
        'eui/comps/tab/tab'
    ],
    function(
        utils,
        grid,
        grideditor,
        tree,
        treenode,
        mask,
        loader,
        paging,
        combo,
        datetime,
        condition,
        conditiongroup,
        window,
        tab
    ) {
        /**
         * @namespace base
         */

        var eui = function() {
            this.utils = $.extend({}, utils);
        };

        /**
         * @namespace comps
         */

        /**
         * @namespace grid
         * @memberof comps
         */

        grid.register(eui.prototype);
        grideditor.register(eui.prototype);

        /**
         * @namespace tree
         * @memberof comps
         */

        tree.register(eui.prototype);
        treenode.register(eui.prototype);
        paging.register(eui.prototype);
        /**
         * @namespace form
         * @memberof comps
         */
        combo.register(eui.prototype);
        datetime.register(eui.prototype);
        condition.register(eui.prototype);
        conditiongroup.register(eui.prototype);
        /**
         * @namespace window
         * @memberof comps
         */
        window.register(eui.prototype);
        /**
         * @namespace tab
         * @memberof comps
         */
        tab.register(eui.prototype);

        /**
         * @namespace effects
         */

        mask.register(eui.prototype);

        /**
         * @namespace data
         */
        loader.register(eui.prototype);

        return new eui();
    });