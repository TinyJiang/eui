'use strict'
/**
 * Tree组件
 *
 * @event init()初始化结束
 * @event select(nodeRecord) 选中
 * @event unselect(nodeRecord) 取消选中
 * @event nodeclick(nodeRecord)单击node
 * @event expand(nodeRecord)展开node
 * @event collapseNode(nodeRecord)收缩node
 *
 * @since 0.1
 * @author JJF
 */
define(['eui/core/clz', 'eui/base/CompBase', 'eui/data/loader', 'eui/core/register'],
    function(clz, CompBase, loader, register) {
        /** ----------------公共参数、方法-----------------* */
        // 初始化dom
        var initDom = function(_tree) {
            var dom = _tree.getDom();
            dom.addClass('euitree');
        }

        // 渲染数据
        var renderData = function(_tree, records) {
            var d = _grid.getDom(),
                conf = _grid.getConf(),
                columns = conf.columns,
                renderObj = {
                    id: conf.id,
                    type: conf.type,
                    headers: [],
                    datas: []
                };

            d.empty().append($(html));
        }

        // 绑定事件
        var bindEvents = function(_tree) {
            // 逻辑事件
            var c = _tree.getConf(),
                loader = c.loader;
            loader.on('beforeload', function() {
                _tree.controlLoadMask(true);
            });
            loader.on('load', function(data) {
                renderData(_tree, data);
            });

            // ui事件
            var d = _grid.getDom();
        }



        /** ----------------类定义-----------------* */
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

        return register(Tree, {
            tree: 'create'
        })

    });