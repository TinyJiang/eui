'use strict'
define(['eui/core/clz', 'eui/base/CompBase', 'eui/utils/utils', 'eui/core/register', 'text!eui/template/tab/tab.html'],
    function(clz, CompBase, utils, register, template) {
        /** ----------------公共参数、方法-----------------* */
        var defaultConf = {
                tabs: [] //tabitemconfig
            },
            CACHE_KEYS = {
                CURRENT_TAB: 'CURRENT_TAB'
            };


        // 初始化dom
        var initDom = function(_tab) {
            var dom = _tab.getDom(),
                c = _tab.getConf(),
                tabs = [];
            dom.empty().addClass('eui-tab');
            if (c.tabs && c.tabs.length) {
                $.each(c.tabs, function(i, tab) {
                    tabs.push($.extend({}, tab, {
                        active: tab.active === true ? 'active' : ''
                    }));
                    if (tab.active === true) {
                        _tab._bindCache(CACHE_KEYS.CURRENT_TAB, tab.id);
                    }
                });
                dom.append(utils.renderTpl(template, {
                    id: _tab.getId(),
                    tabs: tabs
                }));
            }
        }


        // 绑定事件
        var bindEvents = function(_tab) {
            var dom = _tab.getDom();
            // 逻辑事件


            // ui事件
            dom.on('click', 'li a', function() {
                var me = $(this),
                    _current = _tab._getCache(CACHE_KEYS.CURRENT_TAB),
                    id = me.attr('id');
                if (id && id.length > 4) {
                    id = id.substring(0, id.length - 4);
                    if (id !== _current) {
                        /**
                         * @event switch
                         * @memberOf tab
                         * @description tab切换触发
                         * @param {String} id 切换至的tab id
                         */
                        _tab.fire('switch', [id]);
                        _tab._bindCache(CACHE_KEYS.CURRENT_TAB, id);
                    }
                }
            })

        }



        /** ----------------类定义-----------------* */
        var Tab = clz.define({
            name: 'Tab',
            parent: CompBase,
            preConstructor: function(c) {
                c = $.extend({}, defaultConf, c);
                return [c]
            },
            afterConstructor: function(c) {
                initDom(this);
                bindEvents(this);
                return [c]
            },
            proto: {
                setActive: function() {},
                getActive: function(tabItem) {}
            }
        });

        return register(Tab, {
            /**
             * @constructor tab
             * @desc tab控件，挂载至eui.tab
             * @extends CompBase
             * @param {Object} conf 配置对象
             * @param {Object} conf.dom 渲染容器，jquery dom对象
             * @param {Object[]} [conf.tabs=[]] tab配置
             * @param {String} conf.tabs.id tab对应的dom的id，要通过id控制隐藏与显示
             * @param {Boolean} [conf.tabs.active=false] 是否激活，默认显示激活的tab
             * @param {String} [conf.tabs.text=''] tab标题
             * @since 0.1
             * @author JJF
             */
            tab: 'create'
        })

    });