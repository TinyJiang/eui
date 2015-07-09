'use strict'
define(['eui/base/UiBase', 'eui/core/clz', 'eui/core/register', 'eui/utils/utils', 'text!eui/template/paging/paging.html'],
    function(UiBase, clz, register, utils, template) {
        /** ----------------公共参数、方法-----------------* */
        var defaultConf = {
                pageSize: 20,
                totalPath: 'data.total',
                align: 'center'
            },
            CACHE_KEYS = {
                TOTAL: 'TOTAL',
                CURRENT: 'CURRENT',
                PAGENUM: 'PAGENUM'
            };

        var initEvents = function(_paging) {
            // 逻辑事件
            var c = _paging.getConf(),
                loader = c.loader,
                d = _paging.getDom();
            loader.on('beforeload', function() {
                d.children('nav').addClass('euipaging-disabled'); //加载过程中不可再点击
            });

            loader.on('load', function() {
                var total = loader.findData(c.totalPath);
                total = total ? (1 * total) : 0;
                _paging._bindCache(CACHE_KEYS.TOTAL, total);
                /**
                 * @event pagechanged
                 * @memberOf comps.paging.Paging
                 * @description 分页切换完成（数据加载完成）触发
                 * @param {Number} pageNo 当前页码
                 */
                _paging.fire('pagechanged', [_paging._getCache(CACHE_KEYS.CURRENT)]);
                render(_paging);
            });

            //dom事件
            var d = _paging.getDom();
            d.on('click', 'li', function() {
                var me = $(this),
                    name = me.attr('name');
                if (!me.hasClass('disabled')) {
                    if (name == 'select') {} else if (me.hasClass('euipaging-selector')) {
                        goPage(_paging, name * 1);
                    } else {
                        goPage(_paging, name);
                    }
                }
            })
        };

        var goPage = function(_paging, flag) {
            var c = _paging.getConf(),
                loader = c.loader,
                current = _paging._getCache(CACHE_KEYS.CURRENT),
                end = _paging._getCache(CACHE_KEYS.PAGENUM),
                page;
            if ($.type(flag) == 'number') {
                page = flag
            } else {
                switch (flag) {
                    case 'start':
                        page = 1;
                        break;
                    case 'previous':
                        page = current - 1;
                        break;
                    case 'next':
                        page = current + 1;
                        break;
                    case 'end':
                        page = end;
                        break;
                }
            }
            if (page == current) {
                return
            }
            _paging._bindCache(CACHE_KEYS.CURRENT, page);
            /**
             * @event pagechange
             * @memberOf comps.paging.Paging
             * @description 分页切换触发
             * @param {Number} pageNo 当前页码
             * @param {Number} oriPageNo 跳转前页码
             */
            _paging.fire('pagechange', [page, current]);
            loader.load({
                start: (page - 1) * c.pageSize,
                limit: c.pageSize
            });
        }

        var render = function(_paging) {
            var total = _paging._getCache(CACHE_KEYS.TOTAL),
                current = _paging._getCache(CACHE_KEYS.CURRENT),
                c = _paging.getConf(),
                d = _paging.getDom(),
                size = c.pageSize,
                pageNum, renderObj;
            var startDisabled = 'disabled',
                previousDisabled = 'disabled',
                selectDisabled = 'disabled',
                nextDisabled = 'disabled',
                endDisabled = 'disabled';
            pageNum = total % size == 0 ? (total / size) : Math.ceil(total / size);
            _paging._bindCache(CACHE_KEYS.PAGENUM, pageNum);

            if (total > 0) {
                selectDisabled = '';
                if (current > 1) {
                    startDisabled = '';
                    previousDisabled = '';
                }

                if (current < pageNum) {
                    nextDisabled = '',
                    endDisabled = '';
                }
            }


            renderObj = {
                disabled: pageNum ? '' : 'euipaging-disabled',
                pageNum: pageNum,
                current: total == 0 ? 0 : current,
                pages: [],
                startDisabled: startDisabled,
                previousDisabled: previousDisabled,
                selectDisabled: selectDisabled,
                nextDisabled: nextDisabled,
                endDisabled: endDisabled
            };

            for (var i = 1; i <= pageNum; i++) {
                renderObj.pages.push({
                    no: i
                });
            };

            d.empty().append(utils.renderTpl(template, renderObj));
        }

        var initDom = function(_paging) {
            var d = _paging.getDom(),
                c = _paging.getConf();
            d.addClass('euipaging').addClass('text-' + c.align);
        }



        /** ----------------类定义-----------------* */
        var Paging = clz.define({
            name: 'Paging',
            parent: UiBase,
            preConstructor: function(c) {
                c = $.extend({}, defaultConf, c);
                this._bindCache(CACHE_KEYS.TOTAL, 0);
                this._bindCache(CACHE_KEYS.CURRENT, 1);
                this._bindCache(CACHE_KEYS.PAGENUM, 0);
                return [c]
            },
            afterConstructor: function(c) {
                initEvents(this);
                initDom(this);
                render(this);
                return [c]
            },
            proto: {
                goPage: function(index) {
                    goPage(this, index);
                },
                getCurrentPage: function() {
                    return this._getCache(CACHE_KEYS.CURRENT);
                }
            }
        });
        return register(Paging, {
            /**
             * @constructor Paging
             * @memberof comps.paging
             * @desc 分页控件，挂载至eui.paging
             * @extends base.CompBase
             * @param {Object} conf 配置对象
             * @param {Object} conf.dom 渲染容器，jquery dom对象
             * @param {Number} [conf.pageSize=20] 分页条数
             * @param {String} [conf.totalPath='data.total'] total获取路径
             * @param {String} [conf.align='center'] 对其方式
             * @param {data.Loader} conf.loader 数据加载器
             * @since 0.1
             * @author JJF
             */
            paging: 'create'
        })
    });