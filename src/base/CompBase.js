'use strict'
/**
 * CompBase.js
 * @class CompBase
 * @extends UiBase
 * @description 组件基类，增加mask等基础方法
 * @see mask
 * @since 0.1
 * @author JJF
 */
define(['eui/base/UiBase', 'eui/core/clz', 'eui/effects/mask'], function(UiBase, clz, mask) {

    var CompBase = clz.define({
        name: 'CompBase',
        parent: UiBase,
        proto: {
            /** 
             * @memberOf CompBase.prototype
             * @method controlLoadMask
             * @param {Boolean} [isShow=true] 为true时显示mask，false时隐藏mask
             * @description 控制当前组件上的mask隐藏，显示
             * @return {Object} 当前对象
             */
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