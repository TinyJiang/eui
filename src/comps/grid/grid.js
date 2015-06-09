'use strict'
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
            CACHE_KEYS = {
                LINE: 'LINE',
                CELL: 'CELL',
                CURRENTSEL: 'CURRENTSEL',
                RENDERFN: 'RENDERFN'
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
                renderFn = {}, //渲染方法
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
                        renderFn[c.index] = c.render;
                        dataColumns.push(c);
                    }
                    _newColumns.push(c);
                })
                return _newColumns;
            }
            columns = dealFlexWidth(columns, 0);

            conf.dataColumns = dataColumns;
            conf.headRows = headRows;
            _grid._bindCache(CACHE_KEYS.RENDERFN, renderFn);
            return columns
        }

        // 渲染数据
        var renderData = function(_grid, records) {
            var d = _grid.getDom(),
                conf = _grid.getConf(),
                columns = conf.columns,
                dataColumns = conf.dataColumns,
                renderFn = _grid._getCache(CACHE_KEYS.RENDERFN),
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
                _grid._bindCache(CACHE_KEYS.LINE, lineid, {
                    lineIndex: i,
                    lineData: record
                });
                $.each(dataColumns, function(j, c) {
                    var cellid = line.id + '-' + c.index;
                    line.columns.push({
                        id: cellid,
                        value: c
                            .render(record.get(c.index)),
                        align: c.align,
                        width: c.width
                    });
                    _grid._bindCache(CACHE_KEYS.CELL, cellid, {
                        lineIndex: i,
                        cellIndex: j,
                        lineData: record,
                        cellDataIndex: c.index,
                        cellData: record.get(c.index)
                    });
                });
                renderObj.datas.push(line);
                record.on('datachange', function(k, v) { //mv绑定
                    var fn = renderFn[k];
                    $('#' + line.id + '-' + k + ' > div').html(fn ? fn(v) : v);
                });
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
                line_data = _grid._getCache(CACHE_KEYS.LINE,
                    line_id);
            if (line.hasClass('sel')) { // 选中变未选中
                line.removeClass('sel');
                _grid._unbindCache(CACHE_KEYS.CURRENTSEL, line_id); // 解除选中数据绑定
                /**
                 * @event unselect
                 * @memberOf comps.grid.Grid
                 * @description 取消选中触发
                 * @param {Object} lineData 行值
                 * @param {Number} lineData.lineIndex 行号，从0开始
                 * @param {data.Record} lineData.lineData 所在行的record
                 * @param {EventObject} e 事件对象
                 */
                _grid.fire('unselect', [line_data, e]); // 触发unselect事件

            } else { // 未选中变选中
                if (!c.multiSel) {
                    d.find('tr.sel').removeClass('sel');
                    _grid._clearCache(CACHE_KEYS.CURRENTSEL); // 清除所有选中
                }
                line.addClass('sel');
                _grid._bindCache(CACHE_KEYS.CURRENTSEL, line_id, line_data); // 添加当前选中数据
                /**
                 * @event select
                 * @memberOf comps.grid.Grid
                 * @description 选中触发
                 * @param {Object} lineData 行值
                 * @param {Number} lineData.lineIndex 行号，从0开始
                 * @param {data.Record} lineData.lineData 所在行的record
                 * @param {EventObject} e 事件对象
                 */
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
                        ._getCache(CACHE_KEYS.CELL, cell_id);
                    /**
                     * @event cellclick
                     * @memberOf comps.grid.Grid
                     * @description 点击cell触发
                     * @param {Object} cellData cell值对象
                     * @param {Number} cellData.lineIndex 行号，从0开始
                     * @param {Number} cellData.cellIndex 列号，从0开始
                     * @param {String} cellData.cellData 列值
                     * @param {String} cellData.cellIndex 列index
                     * @param {data.Record} cellData.lineData 所在行的record
                     * @param {EventObject} e 事件对象
                     */
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
                        currentSel = _grid._getCache(CACHE_KEYS.CURRENTSEL) || {};
                    if (line.hasClass('sel')) { //取消全选
                        var currentSelDatas = [];
                        for (var i in currentSel) {
                            if (currentSel.hasOwnProperty(i)) {
                                currentSelDatas.push(currentSel[i]);
                            }
                        };
                        d.find('tr').removeClass('sel');
                        _grid._bindCache(CACHE_KEYS.CURRENTSEL, {});
                        _grid.fire('unselect', [currentSelDatas, e]); // 触发unselect事件
                    } else { //启用全选
                        var allLine = _grid._getCache(CACHE_KEYS.LINE),
                            allLineDatas = [];
                        for (var i in allLine) {
                            if (allLine.hasOwnProperty(i) && !currentSel[i]) {
                                allLineDatas.push(allLine[i]);
                            }
                        };
                        d.find('tr').addClass('sel');
                        _grid._bindCache(CACHE_KEYS.CURRENTSEL, $.extend({}, allLine));
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
                    c = me.getConf(),
                    plugins = c.plugins;
                c.columns = columnGenerate(me);
                initDom(me);
                bindEvents(me);
                if (plugins && plugins.length) {
                    $.each(plugins, function(i, p) {
                        p._bindGrid(me);
                    });
                }
            },
            proto:
            /** @lends comps.grid.Grid.prototype */
            {
                /**
                 * @desc 获取数据加载器
                 * @return {data.Loader}  loader
                 */
                getLoader: function() {
                    return this.getConf().loader
                },
                /**
                 * @desc 获取当前选中的records
                 * @return {data.Record[]} 当前选中的records
                 */
                getCurrentSel: function() {
                    var currentSel = this._getCache(CACHE_KEYS.CURRENTSEL),
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
            /**
             * @constructor Grid
             * @memberof comps.grid
             * @desc grid表格控件，挂载至eui.grid
             * @extends base.CompBase
             * @param {Object} conf 配置对象
             * @param {Object} conf.dom 渲染容器，jquery dom对象
             * @param {Boolean} [conf.multiSel=false] 是否多选
             * @param {Boolean} [conf.showCheckBox=undefined] 是否强制显示或不显示checkbox，不指定自动按照multiSel生成，强制指定就按照指定的
             * @param {data.Loader} conf.loader 数据加载器
             * @param {Object[]} [conf.columns=[]] 列配置
             * @param {String} conf.columns.header 列头
             * @param {String} conf.columns.index 数据列
             * @param {String} conf.columns.align 对齐方式
             * @param {Boolean} conf.columns.editable 使用editor插件时是否可编辑
             * @param {Number} conf.columns.flex 百分比宽度，计算方式(flex值/总flex值)(容器总宽度-总固定宽度)
             * @param {Number} [conf.columns.width=80] 宽度
             * @param {Function} [conf.columns.render=undefined] 渲染显示值方法，参数为v
             * @param {Object[]} [conf.columns.columns=[]] 二级分类，字段同columns
             * @since 0.1
             * @author JJF
             */
            grid: 'create'
        })
    });