'use strict'
define(['eui/core/clz', 'eui/base/CompBase', 'eui/utils/utils', 'eui/data/loader', 'eui/core/register', 'eui/comps/tree/treenode', 'text!eui/template/tree/tree.html'],
    function(clz, CompBase, utils, loader, register, treenode, template) {
        /** ----------------公共参数、方法-----------------* */
        var defaultConf = {
                labelIndex: 'label',
                multiSel: false,
                autoExpand: false
            },
            CACHE_KEYS = {
                SELECTIONS: 'SELECTIONS',
                NODES: 'NODES'
            };

        //获取node相关配置
        var getNodeConf = function(_tree) {
            var conf = _tree.getConf();
            return {
                labelIndex: conf.labelIndex,
                autoExpand: conf.autoExpand,
                multiSel: conf.multiSel,
                tree: _tree,
                events: {
                    expand: function(node) {
                        /**
                         * @event expandNode
                         * @memberOf tree
                         * @description 展开node
                         * @param {treenode} node
                         */
                        _tree.fire('expandNode', [node]);
                    },
                    collapse: function(node) {
                        /**
                         * @event collapseNode
                         * @memberOf tree
                         * @description 收缩node
                         * @param {treenode} node
                         */
                        _tree.fire('collapseNode', [node]);
                    },
                    select: function(node) {
                        /**
                         * @event selectNode
                         * @memberOf tree
                         * @description 选中node
                         * @param {treenode} node
                         */
                        _tree.fire('selectNode', [node]);
                    }
                }
            }
        };

        // 初始化dom
        var initDom = function(_tree) {
            var dom = _tree.getDom();
            dom.addClass('euitree');
        }

        // 渲染数据
        var renderData = function(_tree, records) {
            var d = _tree.getDom(),
                conf = getNodeConf(_tree),
                nodes = [];

            var treeInner = $(Mustache.render(template, {
                id: _tree.getId()
            }));

            $.each(records, function(i, record) {
                var node = treenode.create($.extend({}, conf, {
                    record: record
                }));
                treeInner.append(node.getDom());
                nodes.push(node);
            });

            _tree._bindCache(CACHE_KEYS.NODES, nodes);
            d.empty().append(treeInner);
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
        }



        /** ----------------类定义-----------------* */
        var Tree = clz.define({
            name: 'Tree',
            parent: CompBase,
            preConstructor: function(c) {
                if (!utils.isObjOf(c.loader, loader)) {
                    c.loader = loader.create(c.loader);
                }
                c.lazyLoader = clz.clone(c.loader, {
                    autoLoad: false
                });
                c = $.extend({}, defaultConf, c);
                return [c]
            },
            afterConstructor: function(c) {
                var me = this;
                initDom(me);
                bindEvents(me);
                return [c]
            },
            proto:
            /** @lends tree.prototype */
            {
                /**
                 * @desc 获取数据加载器
                 * @see loader
                 * @return {Object}  loader
                 */
                getLoader: function() {
                    return this.getConf().loader
                },
                /**
                 * @desc 获取当前选中的records
                 * @return {record[]} 当前选中的records
                 */
                getSelection: function() {
                    var cache = this._getCache(CACHE_KEYS.SELECTIONS),
                        sels = [];
                    if (cache) {
                        for (var i in cache) {
                            sels.push(cache[i]);
                        }
                    }
                    return sels
                },
                /**
                 * @desc 获取所有一级node节点
                 * @return {treenode[]} 所有一级node节点
                 */
                getNodes: function() {
                    return this._getCache(CACHE_KEYS.NODES)
                },
                /**
                 * @private
                 * @desc 增加选中
                 * @param {treenode} node
                 */
                _addSelection: function(node) {
                    this._bindCache(CACHE_KEYS.SELECTIONS, node.getId(), node);
                },
                /**
                 * @private
                 * @desc 取消选中
                 * @param {treenode} node
                 */
                _removeSelection: function(node) {
                    this._unbindCache(CACHE_KEYS.SELECTIONS, node.getId());
                },
                /**
                 * @private
                 * @desc 清空选中
                 * @param {treenode} node
                 */
                _clearSelection: function() {
                    var sels = this.getSelection();
                    $.each(sels, function(i, node) {
                        node.setChecked(false);
                    })
                    this._bindCache(CACHE_KEYS.SELECTIONS, {});
                }
            }
        });

        return register(Tree, {
            /**
             * @constructor tree
             * @desc tree组件，挂载至eui.tree
             * @extends CompBase
             * @param {Object} conf 配置对象
             * @param {loader} conf.loader 数据加载器
             * @param {Object} conf.dom 渲染容器，jquery dom对象
             * @param {String} conf.labelIndex label字段
             * @param {Boolean} [conf.multiSel=false] 是否多选
             * @param {Boolean} [conf.autoExpand=false] 是否自动展开
             * @since 0.1
             * @author JJF
             */
            tree: 'create'
        })

    });