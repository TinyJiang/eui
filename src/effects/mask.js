'use strict'
/**
 * 控制dom mask效果
 *
 * @since 0.1
 * @author JJF
 */

define(['eui/utils/exception', 'eui/base/UiBase', 'eui/core/clz', 'eui/core/register', 'text!eui/template/effects/mask/load.html', 'text!eui/template/effects/mask/text.html', 'text!eui/template/effects/mask/progress.html'],
    function(e, UiBase, clz, register, loadTemplate, textTemplate, progressTemplate) {
        /** ----------------公共参数、方法-----------------* */
        var TYPES = { //支持类型
                'text': textTemplate,
                'load': loadTemplate,
                'progress': progressTemplate
            },
            defaultConfig = {
                type: 'load',
                text: '',
                progress: 20,
                showProgressText: 'show' //show or hide
            }

        //创建mask的dom对象
        var createMaskDom = function(cnt, config) {
            var cHeight = cnt.outerHeight(),
                cWidth = cnt.outerWidth(),
                pos = cnt.position(),
                template = TYPES[config.type],
                dom;
            if (template) {
                dom = $(Mustache.render(template, config));
                dom.css({
                    width: cWidth + 'px',
                    height: cHeight + 'px',
                    left: pos.left + 'px',
                    top: pos.top + 'px',
                    'line-height': cHeight + 'px'
                })
                return dom
            } else {
                e.throwException('NotFoundException', [config.type, 'support mask type']);
            }
        };

        var checkMask = function(_mask) {
            var cnt = _mask._getCache('cnt'),
                dom = _mask.getDom(),
                maskDom = cnt.find('eui-mask');

            if (!maskDom.length) {
                cnt.append(dom);
            }
        };

        /** ----------------公共参数、方法-----------------* */

        /** ----------------类定义-----------------* */


        var Mask = clz.define({
            name: 'Mask',
            parent: UiBase,
            preConstructor: function(c) {
                var me = this,
                    d = c.container,
                    dom;
                c = $.extend({}, defaultConfig, c);
                me._bindCache('cnt', d); //绑定容器
                c.dom = createMaskDom(d, c);
                me.on('beforeshow', function() {
                    checkMask(me);
                })
                return [c]
            },
            proto: {
                updateText: function() { //text mask专用

                },
                complete: function() { //progress专用

                },
                setPercent: function(percent, during) { //progress专用

                }
            }
        });

        return register(Mask, {
            mask: 'create'
        });
    })