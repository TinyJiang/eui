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
                multiSel: false,
                showCheckBox: undefined //不指定自动按照multiSel生成，强制指定就按照指定的
            },
            columnDefault = {
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

        // 列数据处理
        var columnGenerate = function(_grid) {
            var conf = _grid.getConf(),
                columns = conf.columns,
                d = _grid.getDom(),
                total = d.innerWidth(),
                dataColumns = []; //真正展现数据的列

            var _used = 0,
                _flexTotal = 0,
                headRows = 0;

            var dealAllWidth = function(_columns, rowIndex) {
                var w = 0,
                    _newColumns = [];
                rowIndex += 1;
                headRows = rowIndex > headRows ? rowIndex : headRows;
                $.each(_columns, function(i, c) {
                    if (c.columns && c.columns.length) {
                        c.columns = dealAllWidth(c.columns, rowIndex);
                    } else {
                        if (c.width) {
                            _used += c.width;
                        } else if (c.flex) {
                            _flexTotal += c.flex;
                        }
                    }
                    _newColumns.push(c);
                })
                return _newColumns;
            };
            columns = dealAllWidth(columns, 0);
            if (conf.showCheckBox) {
                _used += 50;
            }
            var _left = total > _used ? total - _used : total;
            var dealFlexWidth = function(_columns, rowIndex) {
                var _newColumns = [];
                rowIndex += 1;
                $.each(_columns, function(i, c) {
                    c = $.extend({}, columnDefault, c);
                    c.level = rowIndex - 1;
                    if (c.columns && c.columns.length) {
                        c.colspan = c.columns.length;
                        c.rowspan = 1;
                        c.columns = dealFlexWidth(c.columns, rowIndex);
                    } else {
                        if (c.flex) {
                            c.width = c.flex / _flexTotal * _left;
                        }
                        c.rowspan = headRows - rowIndex + 1;
                        c.colspan = 1;
                        c.width = c.width ? c.width : 80; //默认80宽度
                        dataColumns.push(c);
                    }
                    _newColumns.push(c);
                })
                return _newColumns;
            }
            columns = dealFlexWidth(columns, 0);

            conf.dataColumns = dataColumns;
            conf.headRows = headRows;
            return columns
        }

        // 渲染数据
        var renderData = function(_grid, records) {
            var d = _grid.getDom(),
                conf = _grid.getConf(),
                columns = conf.columns,
                dataColumns = conf.dataColumns,
                renderObj = {
                    id: conf.id,
                    type: conf.type,
                    headRows: conf.headRows,
                    firstHeader: {
                        headers: []
                    },
                    extendHeaders: [],
                    showCheckBox: (conf.showCheckBox ? 'show' : 'hide'),
                    datas: []
                };

            var dealHeadLine = function(_columns) {
                $.each(_columns, function(i, c) {
                    var lv = c.level,
                        isLast = i == _columns.length - 1,
                        hearObj = {
                            header: c.header,
                            width: c.width - 1, //减去1px的border
                            align: c.align,
                            colspan: c.colspan,
                            rowspan: c.rowspan,
                            isLast: isLast ? 'last' : ''
                        };
                    if (lv) {
                        var headerRow = renderObj.extendHeaders[lv - 1] || {
                            headers: []
                        };
                        headerRow.headers.push(hearObj);
                        renderObj.extendHeaders[lv - 1] = headerRow;
                    } else { //第一层
                        renderObj.firstHeader.headers.push(hearObj);
                    }
                    if (c.columns && c.columns.length) {
                        dealHeadLine(c.columns);
                    }
                })
            }
            dealHeadLine(columns);

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
                $.each(dataColumns, function(j, c) {
                    var cellid = line.id + '-' + j;
                    line.columns.push({
                        id: cellid,
                        value: c
                            .render(record.get(c.index)),
                        align: c.align,
                        width: c.width
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

            //设置body高度
            //var totalHeight = d.innerHeight(),
            //    headerHeight = $('#' + conf.id + '-head').height();
            //$('#' + conf.id + '-body-cnt').height(totalHeight - headerHeight);
        }

        // 选中条目
        var lineClick = function(e, _grid, line) {
            var c = _grid.getConf(),
                d = _grid.getDom(),
                line_id = line
                .attr('id'),
                line_data = _grid._getCache('line',
                    line_id);
            if (line.hasClass('sel')) { // 选中变未选中
                line.removeClass('sel');
                _grid._unbindCache('currentSel', line_id); // 解除选中数据绑定
                _grid.fire('unselect', [line_data, e]); // 触发unselect事件

            } else { // 未选中变选中
                if (!c.multiSel) {
                    d.find('tr.sel').removeClass('sel');
                    _grid._clearCache('currentSel'); // 清除所有选中
                }
                line.addClass('sel');
                _grid._bindCache('currentSel', line_id, line_data); // 添加当前选中数据
                _grid.fire('select', [line_data, e]); // 触发select事件
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

            d.on('click', 'tbody tr td', function(e) {
                // cell处理
                var cell = $(this),
                    cell_id = this.id;
                if (cell_id.lastIndexOf('check') != cell_id.length - 5) {
                    var cell_data = _grid
                        ._getCache('cell', cell_id);
                    _grid.fire('cellclick', [cell_data, e]);
                }

                // line处理
                var line = cell.parent();
                lineClick(e, _grid, line);
            });

            d.on('click', 'thead tr th', function() {
                var cell = $(this),
                    cell_id = this.id;
                if (cell_id.lastIndexOf('check') == cell_id.length - 5) { //全选
                    var line = cell.parent(),
                        currentSel = _grid._getCache('currentSel') || {};
                    if (line.hasClass('sel')) { //取消全选
                        var currentSelDatas = [];
                        for (var i in currentSel) {
                            if (currentSel.hasOwnProperty(i)) {
                                currentSelDatas.push(currentSel[i]);
                            }
                        };
                        d.find('tr').removeClass('sel');
                        _grid._bindCache('currentSel', {});
                        _grid.fire('unselect', [currentSelDatas, e]); // 触发unselect事件
                    } else { //启用全选
                        var allLine = _grid._getCache('line'),
                            allLineDatas = [];
                        for (var i in allLine) {
                            if (allLine.hasOwnProperty(i) && !currentSel[i]) {
                                allLineDatas.push(allLine[i]);
                            }
                        };
                        d.find('tr').addClass('sel');
                        _grid._bindCache('currentSel', $.extend({}, allLine));
                        _grid.fire('select', [allLineDatas, e]); // 触发select事件
                    }
                }
            });
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
                    if (c.showCheckBox === undefined) {
                        c.showCheckBox = c.multiSel;
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