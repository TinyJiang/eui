'use strict'
/**
 * GRID表格组件
 *
 * @event init()初始化结束
 * @event select(lineData)选中
 * @event unselect(lineData)取消选中
 * @event cellclick(cellData)单击cell
 *
 * @since 0.1
 * @author JJF
 */
define(['eui/utils/exception', 'eui/utils/utils', 'eui/data/loader', 'eui/base/CompBase', 'eui/core/clz',
        'eui/core/register', 'text!eui/template/grid/grid.html'
    ],
    function(e, utils, loader, CompBase, clz, register, template) {
        /** ----------------公共参数、方法-----------------* */
        var gridIndex = 0,
            defaultConf = {
                multiSel: false
            },
            columnDefault = {
                width: 80,
                align: 'left',
                render: function(val) {
                    return val
                }
            };
        // 验证输入
        var validate = function(dom, conf) {
            if (dom && dom.length && conf) {
                return true
            } else {
                e.throwException('IllegalArgumentException', ['dom conf',
                    '', 'not null'
                ])
            }
        };

        // 列宽处理
        var generateWidth = function(columns, total) {
            var _used = 0,
                _flexTotal = 0;
            $.each(columns, function(i, c) {
                if (c.width) {
                    _used += c.width;
                } else if (c.flex) {
                    _flexTotal += c.flex;
                }
            })
            var _left = total - _used;
            if (_flexTotal && _left > 0) {
                $.each(columns, function(i, c) {
                    if (c.flex) {
                        c.width = c.flex / _flexTotal * _left;
                    }
                })
            }
            return columns
        };

        // 列数据处理
        var columnGenerate = function(_grid) {
            var columns = _grid.getConf().columns,
                d = _grid.getDom();
            columns = generateWidth(columns, d.innerWidth());
            var newColumns = [];
            $.each(columns, function(i, c) {
                newColumns.push($.extend({}, columnDefault, c));
            })
            return newColumns
        }

        // 渲染数据
        var renderData = function(_grid, records) {
            var d = _grid.getDom(),
                conf = _grid.getConf(),
                columns = conf.columns,
                renderObj = {
                    id: conf.id,
                    type: conf.type,
                    headers: [],
                    datas: []
                };
            $.each(columns, function(i, c) {
                renderObj.headers.push({
                    header: c.header,
                    width: c.width,
                    align: c.align
                });
            })
            $.each(records, function(i, record) {
                var lineid = renderObj.id + '-' + i;
                var line = {
                    id: lineid,
                    columns: []
                };
                _grid._bindCache('line', lineid, {
                    lineIndex: i,
                    lineData: record
                });
                $.each(columns, function(j, c) {
                    var cellid = line.id + '-' + j;
                    line.columns.push({
                        id: cellid,
                        value: c
                            .render(record.get(c.index)),
                        align: c.align
                    });
                    _grid._bindCache('cell', cellid, {
                        lineIndex: i,
                        cellIndex: j,
                        lineData: record,
                        cellDataIndex: c.index,
                        cellData: record.get(c.index)
                    });
                });
                renderObj.datas.push(line);
            });
            var html = Mustache.render(template, renderObj);
            d.empty().append($(html));
        }

        // 选中条目
        var lineClick = function(_grid, line) {
            var c = _grid.getConf(),
                d = _grid.getDom(),
                line_id = line
                .attr('id'),
                line_data = _grid._getCache('line',
                    line_id);
            if (line.hasClass('sel')) { // 选中变未选中
                line.removeClass('sel');
                _grid._unbindCache('currentSel', line_id); // 解除选中数据绑定
                _grid.fire('unselect', [line_data]); // 触发unselect事件

            } else { // 未选中变选中
                if (!c.multiSel) {
                    d.find('tr.sel').removeClass('sel');
                    _grid._clearCache('currentSel'); // 清除所有选中
                }
                line.addClass('sel');
                _grid._bindCache('currentSel', line_id, line_data); // 添加当前选中数据
                _grid.fire('select', [line_data]); // 触发select事件
            }
        }

        // 绑定事件
        var bindEvents = function(_grid) {
            // 逻辑事件
            var c = _grid.getConf(),
                loader = c.loader;
            loader.on('beforeload', function() {
                _grid.controlLoadMask(true);
            });
            loader.on('load', function(data) {
                renderData(_grid, data);
            });

            // ui事件
            var d = _grid.getDom();
            d.on('click', 'tbody tr td', function() {
                // cell处理
                var cell = $(this),
                    cell_id = this.id;
                if (cell_id.lastIndexOf('check') != cell_id.length - 5) {
                    var cell_data = _grid
                        ._getCache('cell', cell_id);
                    _grid.fire('cellclick', [cell_data]);
                }

                // line处理
                var line = cell.parent();
                lineClick(_grid, line);
            })
        }

        // 初始化dom
        var initDom = function(_grid) {
            var dom = _grid.getDom();
            dom.addClass('euigrid');
        }

        /** ----------------类定义-----------------* */
        var Grid = clz.define({
            name: 'Grid',
            parent: CompBase,
            preConstructor: function(c) {
                var d = c.dom;
                if (validate(d, c)) {
                    // 初始化conf配置
                    c = $.extend({}, defaultConf, c);
                    if (!utils.isObjOf(c.loader, loader)) {
                        c.loader = loader.create(c.loader);
                    }
                }
                return [c]
            },
            afterConstructor: function() {
                var me = this,
                    c = me.getConf();
                c.columns = columnGenerate(me);
                initDom(me);
                bindEvents(me);
            },
            proto: {
                getLoader: function() {
                    return this.getConf().loader
                },
                getCurrentSel: function() {
                    var currentSel = this._getCache('currentSel'),
                        sel = [];
                    if (currentSel) {
                        for (var i in currentSel) {
                            sel.push(currentSel[i]);
                        }
                    }
                    return sel
                }
            }
        });

        return register(Grid, {
            grid: 'create'
        })
    });