'use strict'
/**
 * Window组件
 *
 * @event init()初始化结束
 * @event show() 显示
 * @event hide() 隐藏
 * @event contentchange() 内部内容改变
 * @since 0.1
 * @author JJF
 */
define(['eui/core/clz', 'eui/base/CompBase', 'eui/utils/utils', 'eui/core/register', 'text!eui/template/window/window.html'],
    function(clz, CompBase, utils, register, template) {
        /** ----------------公共参数、方法-----------------* */
        var defaultConf = {
                title: '',
                width: 0,
                btns: []
            },
            CACHE_KEYS = {

            };


        // 初始化dom
        var initDom = function(_window) {
            var c = _window.getConf(),
                id = _window.getId(),
                d, btns = [];
            if (c.btns && c.btns.length) {
                $.each(c.btns, function(i, btn) {
                    btns.push($.extend({}, btn, {
                        id: id + '-btn-' + i
                    }));
                });
                c.btns = btns;
            }
            d = utils.renderTpl(template, c);
            $('body').append(d);
            _window._bindDom(d);
            if (c.content && c.content.length) {
                _window.updateContent(c.content);
            }
            if (c.width) {
                d.children('.modal-dialog').width(c.width);
            }
        }


        // 绑定事件
        var bindEvents = function(_window) {
            var c = _window.getConf(),
                d = _window.getDom();
            // 逻辑事件

            // ui事件
            d.on('shown.bs.modal', function() {
                /**
                 * @event show
                 * @memberOf window
                 * @description 显示触发
                 */
                _window.fire('show', []);
            }).on('hidden.bs.modal', function() {
                /**
                 * @event hide
                 * @memberOf window
                 * @description 隐藏触发
                 */
                _window.fire('hide', []);
            })

            if (c.btns && c.btns.length) {
                $.each(c.btns, function(i, btn) {
                    $('#' + btn.id).on('click', function() {
                        btn.handler.apply(_window, []);
                    })
                });
            }
        }



        /** ----------------类定义-----------------* */
        var Window = clz.define({
            name: 'Window',
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
            proto:
            /** @lends treenode.prototype */
            {
                /**
                 * @desc 获取content body
                 * @return {Object}  body
                 */
                getBody: function() {
                    return $('#' + this.getId() + '-body')
                },
                /**
                 * @desc 更新内容
                 * @param {dom}  dom
                 */
                updateContent: function(dom) {
                    this.getBody().empty().append(dom);
                    /**
                     * @event contentchange
                     * @memberOf window
                     * @description 内容更新触发
                     */
                    this.fire('contentchange', []);
                },
                /**
                 * @desc 更新内容
                 * @override
                 */
                show: function() {
                    var d = this.getDom();
                    d.modal('show');
                },
                /**
                 * @desc 更新内容
                 * @override
                 */
                hide: function() {
                    var d = this.getDom();
                    d.modal('hide');
                }
            }
        });

        return register(Window, {
            /**
             * @constructor window
             * @desc window窗口组件，挂载至eui.window
             * @extends CompBase
             * @param {Object} conf 配置对象
             * @param {String} conf.title title
             * @param {Number} [conf.width=0] 宽度
             * @param {Object} conf.content 内容jquery dom对象
             * @param {Object[]} [conf.btns=[]] 按钮
             * @param {String} conf.btns.text 按钮文字
             * @param {String} [conf.btns.cls=''] 按钮样式class
             * @param {Function} [conf.btns.handler=undefined] 按钮触发事件, scope = window
             * @since 0.1
             * @author JJF
             */
            window: 'create'
        })

    });