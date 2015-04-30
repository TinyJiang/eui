'use strict'
/**
 * 组件基类
 * 增加绑定mask等基础方法
 *
 * @since 0.1
 * @author JJF
 */
define(['eui/base/UiBase', 'eui/core/clz', 'eui/effects/mask'], function(UiBase, clz, mask) {

    var CompBase = clz.define({
        name: 'CompBase',
        parent: UiBase,
        proto: {
            controlLoadMask: function(isShow) {
                var me = this,
                    d = me.getDom(),
                    _mask = me._getCache('mask');
                if (!_mask) {
                    _mask = mask.create({
                        container: d
                    });
                    me._bindCache('mask', _mask);
                }
                return isShow ? _mask.show() : _mask.hide();
            }
        }
    });

    return CompBase
});