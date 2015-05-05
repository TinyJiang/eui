'use strict'
/**
 * 树节点
 *
 * @event init()初始化结束
 * @event expand(treenode)展开
 * @event collapse(treenode)收缩
 * @event select(treenode)选中
 * @event unselect(treenode)取消选中
 *
 * @since 0.1
 * @author JJF
 */
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
                label: record.get(c.labelIndex)
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
                    me.isLeaf = false;
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
            proto: {
                getChildren: function() {
                    return this._getCache(CACHE_KEYS.CHILDREN)
                },
                getRecord: function() {
                    return this.getConf().record;
                },
                isChecked: function() {
                    return !!this._getCache(CACHE_KEYS.CHECK_FLAG)
                },
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
                    me.fire(flag ? 'select' : 'unselect', [me])
                },
                expand: function() {
                    var me = this,
                        c = me.getConf(),
                        d = me.getDom(),
                        childrenCnt = d.children('.children-cnt');

                    var complete = function() {
                        d.removeClass('treenode-loading').removeClass('treenode-collapsed').addClass('treenode-expanded');
                        me.expanded = true;
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
                collapse: function() {
                    var me = this,
                        d = me.getDom(),
                        childrenCnt = d.children('.children-cnt');
                    d.removeClass('treenode-expanded').addClass('treenode-collapsed');
                    me.expanded = false;
                    me.fire('collapse', [me]);
                },
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
            treenode: 'create'
        })
    });