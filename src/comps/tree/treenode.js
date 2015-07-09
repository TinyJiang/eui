'use strict'
define(['eui/base/UiBase', 'eui/utils/utils', 'eui/core/clz', 'eui/data/record', 'eui/core/register', 'text!eui/template/tree/treenode.html'],
    function(UiBase, utils, clz, record, register, template) {
        /** ----------------公共参数、方法-----------------* */
        var CACHE_KEYS = {
            CHILDREN: 'CHILDREN',
            CHECK_FLAG: 'CHECK_FLAG'
        };
        var initDom = function(node) {
            var c = node.getConf(),
                record = c.record,
                children = node.getChildren();
            var dom = node.getDom() || $(Mustache.render(template, {
                isExpand: node.expanded ? 'expanded' : 'collapsed',
                id: node.getId(),
                multiSel: c.multiSel ? 'multiSel' : 'singleSel',
                type: node.isLeaf ? 'file' : 'folder',
                label: c.nodeRender(record.get(c.labelIndex), record)
            }));

            var childrenCnt = dom.children('.children-cnt');
            $.each(children, function(i, child) {
                childrenCnt.append(child.getDom());
            });
            node._bindDom(dom);
            return dom
        }

        var initChildren = function(node) {
            var c = node.getConf(),
                children = [],
                _children = c.record.get('children');
            if ($.type(_children) == 'array') {
                $.each(_children, function(i, child) {
                    children.push(TreeNode.create($.extend({}, c, {
                        id: '', //id不要传入子节点
                        record: utils.isObjOf(child, record) ? child : record.create(child)
                    })));
                });
            }
            node._bindCache(CACHE_KEYS.CHILDREN, children);
        }

        var initEvents = function(node) {
            var d = node.getDom(),
                c = node.getConf(),
                tree = c.tree;
            d.on('click', '.label-cnt', function(e) {
                var me = $(this),
                    target = $(e.target);
                if (node.getId() !== me.parent().attr('id')) {
                    return false
                }
                if (target.hasClass('expand-icon') && !node.isLeaf) { //点击展开收缩按钮，则执行展开或者收缩操作
                    node.tonggle();
                } else {
                    node.setChecked(!node.isChecked());
                }
                return false
            });

            c.record.on('datachange', function(k, v) {
                if (k === c.labelIndex) {
                    d.children('.label-cnt').children('span').html(v);
                }
                if (k === 'checked' && (v === true || v === 'true')) {
                    node.setChecked(true);
                }
            });
        };

        /** ----------------类定义-----------------* */
        var TreeNode = clz.define({
            name: 'TreeNode',
            parent: UiBase,
            preConstructor: function(c) {
                var me = this,
                    record = c.record,
                    children = record.get('children'),
                    leaf = record.get('leaf');
                if (($.type(leaf) == 'boolean' && leaf) || ('true' == leaf)) {
                    me.isLeaf = true;
                } else if (children && children.length) {
                    me.isLeaf = false;
                } else {
                    me.isLeaf = true;
                }

                if (c.autoExpand && children && children.length) {
                    me.expanded = true;
                } else {
                    me.expanded = false;
                }
                return [c]
            },
            afterConstructor: function(c) {
                initChildren(this);
                initDom(this);
                initEvents(this);
                return [c]
            },
            proto:
            /** @lends comps.tree.Treenode.prototype */
            {
                /**
                 * @desc 获取子节点
                 * @return {comps.tree.Treenode[]}  childs
                 */
                getChildren: function() {
                    return this._getCache(CACHE_KEYS.CHILDREN)
                },
                /**
                 * @desc 获取record数据
                 * @return {data.Record}  rec
                 */
                getRecord: function() {
                    return this.getConf().record;
                },
                /**
                 * @desc 判断是否被选中
                 * @return {Boolean}  isChecked
                 */
                isChecked: function() {
                    return !!this._getCache(CACHE_KEYS.CHECK_FLAG)
                },
                /**
                 * @desc 设置是否选中
                 * @param {Boolean}  checked ture为选中，false为不选中
                 */
                setChecked: function(flag) {
                    var me = this,
                        d = me.getDom(),
                        c = me.getConf(),
                        tree = c.tree;
                    if (flag) {
                        if (!c.multiSel) {
                            tree._clearSelection();
                        }
                        d.addClass('treenode-selected');
                        tree._addSelection(me);
                    } else {
                        tree._removeSelection(me);
                        d.removeClass('treenode-selected');
                    }

                    me._bindCache(CACHE_KEYS.CHECK_FLAG, flag);
                    /**
                     * @event select
                     * @memberOf comps.tree.Treenode
                     * @description 选中触发
                     * @param {comps.tree.Treenode} node 树节点
                     */

                    /**
                     * @event unselect
                     * @memberOf comps.tree.Treenode
                     * @description 取消选中触发
                     * @param {comps.tree.Treenode} node 树节点
                     */
                    me.fire(flag ? 'select' : 'unselect', [me])
                },
                /**
                 * @desc 展开节点
                 */
                expand: function() {
                    var me = this,
                        c = me.getConf(),
                        d = me.getDom(),
                        childrenCnt = d.children('.children-cnt');

                    var complete = function() {
                        d.removeClass('treenode-loading').removeClass('treenode-collapsed').addClass('treenode-expanded');
                        me.expanded = true;
                        /**
                         * @event expand
                         * @memberOf comps.tree.Treenode
                         * @description 展开节点触发
                         * @param {comps.tree.Treenode} node 树节点
                         */
                        me.fire('expand', [me]);
                    }
                    if (!c.isLeaf && (!me.getChildren() || !me.getChildren().length)) { //需要进行懒加载
                        d.removeClass('treenode-collapsed').addClass('treenode-loading');
                        var lazyLoader = c.tree.getConf().lazyLoader;
                        lazyLoader.updateParam({
                            node: me.getId()
                        });
                        lazyLoader.on('load', function(data) {
                            c.record.set('children', data);
                            initChildren(me);
                            initDom(me);
                            complete();
                            lazyLoader.off('load');
                        })
                        lazyLoader.load();
                    } else {
                        complete();
                    }

                },
                /**
                 * @desc 收缩节点
                 */
                collapse: function() {
                    var me = this,
                        d = me.getDom(),
                        childrenCnt = d.children('.children-cnt');
                    d.removeClass('treenode-expanded').addClass('treenode-collapsed');
                    me.expanded = false;
                    /**
                     * @event collapse
                     * @memberOf comps.tree.Treenode
                     * @description 收缩节点触发
                     * @param {comps.tree.Treenode} node 树节点
                     */
                    me.fire('collapse', [me]);
                },
                /**
                 * @desc 展开/收缩节点
                 */
                tonggle: function() {
                    var me = this;
                    if (me.expanded) {
                        me.collapse();
                    } else {
                        me.expand();
                    }
                }
            }
        });

        return register(TreeNode, {
            /**
             * @constructor Treenode
             * @memberof comps.tree
             * @desc treenode组件，挂载至eui.treenode，一般由tree自动生成
             * @extends base.CompBase
             * @param {Object} conf 配置对象
             * @param {String} conf.labelIndex label字段
             * @param {Boolean} [conf.autoExpand=false] 是否自动展开
             * @param {Boolean} [conf.multiSel=false] 是否多选
             * @param {comps.tree.Tree} conf.tree tree
             * @since 0.1
             * @author JJF
             */
            treenode: 'create'
        })
    });