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
                ENABLED: 'enabled'
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
                record.forEach(function(k, v) {
                    $('#' + grid.getId() + '-editor-' + k).val(v);
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
                            record.set(input.attr('id').substr(grid.getId().length + 8), input.val());
                        })
                    } else if (name == 'cancel') {
                        setEditorValue(_editor, record);
                    }
                    editor.hide();
                });
            }

            grid.on('cellclick', function(cellData, e) {
                var tr, columns, record, editor, renderObj = {
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
                                    id: grid.getId() + '-editor-' + c.index,
                                    value: record.get(c.index),
                                    align: c.align,
                                    width: c.width
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