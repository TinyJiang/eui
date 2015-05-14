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
                _window.fire('show', []);
            }).on('hidden.bs.modal', function() {
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
            proto: {
                getBody: function() {
                    return $('#' + this.getId() + '-body')
                },
                updateContent: function(dom) {
                    this.getBody().empty().append(dom);
                    this.fire('contentchange', []);
                },
                show: function() {
                    var d = this.getDom();
                    d.modal('show');
                },
                hide: function() {
                    var d = this.getDom();
                    d.modal('hide');
                }
            }
        });

        return register(Window, {
            window: 'create'
        })

    });