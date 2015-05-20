'use strict'
/**
 * Tab组件
 *
 * @event init()初始化结束
 * @event switch(tabid) 显示
 * @since 0.1
 * @author JJF
 */
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
            tab: 'create'
        })

    });