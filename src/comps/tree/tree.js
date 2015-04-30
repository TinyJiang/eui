'use strict'
/**
 * Tree组件
 *
 * @event init()初始化结束
 * @event select(nodeRecord)选中
 * @event unselect(nodeRecord)取消选中
 * @event nodeclick(nodeRecord)单击node
 * @event expand(nodeRecord)展开node
 * @event collapseNode(nodeRecord)收缩node
 *
 * @since 0.1
 * @author JJF
 */
define(['eui/core/clz', 'eui/base/CompBase', 'eui/data/loader'], function(clz, CompBase, loader) {
    var Tree = clz.define({
        name: 'Tree',
        parent: CompBase,
        preConstructor: function(c) {
            var d = c.dom;
            if (!utils.isObjOf(c.loader, loader)) {
                c.loader = loader.create(c.loader);
            }
            return [c]
        },
        afterConstructor: function() {
            var me = this,
                c = me.getConf();
            domInit(me);
            bindEvents(me);
        },
        proto: {}
    });

});