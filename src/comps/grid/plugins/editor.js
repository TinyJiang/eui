'use strict'
define(['eui/base/UiBase', 'eui/core/clz', 'eui/utils/utils', 'eui/core/register', 'text!eui/template/grid/editor.html'],
    function(UiBase, clz, utils, register, template) {
        var defaultConf = {
                enabled: false
            },
            CACHE_KEYS = {
                EDITORDOM: 'EDITORDOM',
                CURRENTRECORD: 'CURRENTRECORD',
                GRID: 'grid',
                ENABLED: 'enabled',
                DISABLEDCOLUMNS: 'DISABLEDCOLUMNS'
            };

        var findTr = function(node) {
            if (!node) {
                return
            }
            if (node.tagName == 'TR') {
                return node;
            } else {
                return findTr(node.parentNode);
            }
        }

        var setEditorValue = function(_editor, record) {
            var editor = _editor._getCache(CACHE_KEYS.EDITORDOM),
                grid = _editor[CACHE_KEYS.GRID];
            if (editor && editor.length) {
                var inputs = editor.find('input');
                $.each(inputs, function(i, input) {
                    input = $(input);
                    input.val(record.get(input.attr('data-index')) || '')
                });
            }
        };

        var bindEvents = function(_editor) {
            var grid = _editor[CACHE_KEYS.GRID];

            var editorEvents = function(editor) {
                editor.on('click', 'button', function() {
                    var btn = $(this),
                        name = btn.attr('name'),
                        record = _editor._getCache(CACHE_KEYS.CURRENTRECORD);
                    if (!record) {
                        return
                    }
                    if (name == 'submit') {
                        $.each(editor.find('td input'), function(i, input) {
                            input = $(input);
                            record.set(input.attr('data-index'), input.val());
                        })
                        /**
                         * @event editcomplete
                         * @memberOf comps.grid.GridEditor
                         * @description 编辑完成事件
                         * @param {data.Record} 所在行的record
                         */
                        _editor.fire('editcomplete', [record]);
                    } else if (name == 'cancel') {
                        setEditorValue(_editor, record);
                    }
                    editor.hide();
                });
            }

            grid.on('cellclick', function(cellData, e) {
                var tr, columns, record, editor, disabledColumns = _editor._getCache(CACHE_KEYS.DISABLEDCOLUMNS),
                    renderObj = {
                        id: _editor.getId(),
                        columns: []
                    };
                if (_editor.isEnabled()) {
                    tr = findTr(e.target), record = cellData.lineData;
                    if (tr) {
                        _editor._bindCache(CACHE_KEYS.CURRENTRECORD, record);
                        tr = $(tr);
                        editor = _editor._getCache(CACHE_KEYS.EDITORDOM);
                        if (editor) {
                            setEditorValue(_editor, record);
                        } else {
                            columns = $.extend([], grid.getConf().dataColumns);
                            $.each(columns, function(i, c) {
                                renderObj.columns.push({
                                    id: _editor.getId() + '-' + c.index,
                                    value: record.get(c.index),
                                    index: c.index,
                                    align: c.align,
                                    width: c.width,
                                    showEdit: disabledColumns[c.index] ? 'hide' : '',
                                    hideEdit: disabledColumns[c.index] ? '' : 'hide',
                                })
                            });
                            editor = utils.renderTpl(template, renderObj);
                            $('body').append(editor);
                            _editor._bindCache(CACHE_KEYS.EDITORDOM, editor);
                            editorEvents(editor);
                        }
                        editor.show().animate({
                            left: tr.position().left,
                            top: tr.position().top,
                            width: tr.width()
                        }, 300);
                    }
                }
            });
        };

        var initColumns = function(_editor) {
            var grid = _editor[CACHE_KEYS.GRID],
                columns = grid.getConf().dataColumns,
                disabledColumns = {};
            $.each(columns, function(i, c) {
                if (c.editable === false) {
                    disabledColumns[c.index] = true;
                }
            });
            _editor._bindCache(CACHE_KEYS.DISABLEDCOLUMNS, disabledColumns);
        };

        var startEditor = function(lineDom) {};
        var GridEditorPlugin = clz.define({
            name: 'GridEditorPlugin',
            parent: UiBase,
            preConstructor: function(c) {
                c = $.extend({}, defaultConf, c);
                if (c.enabled) {
                    this.enable();
                }
                return [c]
            },
            proto:
            /** @lends comps.grid.GridEditor.prototype */
            {
                /**
                 * @private
                 * @desc 绑定使用的grid
                 * @param {comps.grid.Grid} grid
                 */
                _bindGrid: function(_grid) {
                    this[CACHE_KEYS.GRID] = _grid;
                    bindEvents(this);
                    initColumns(this);
                },
                /**
                 * @desc 启用控件
                 */
                enable: function() {
                    this[CACHE_KEYS.ENABLED] = true;
                },
                /**
                 * @desc 禁用控件
                 */
                disable: function() {
                    this[CACHE_KEYS.ENABLED] = false;
                },
                /**
                 * @desc 判断控件是否已启用
                 * @return {Boolean}
                 */
                isEnabled: function() {
                    return !!this[CACHE_KEYS.ENABLED]
                }
            }
        });
        return register(GridEditorPlugin, {
            /**
             * @constructor GridEditor
             * @memberof comps.grid
             * @desc grid表格行内编辑控件，挂载eui.grideditor
             * @extends base.UiBase
             * @param {Object} conf 配置对象
             * @param {Boolean} [conf.enabled=false] 因为单击会出现编辑，默认禁用，需要时启用即可
             * @since 0.1
             * @author JJF
             */
            grideditor: 'create'
        })
    });