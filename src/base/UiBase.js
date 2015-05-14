'use strict'
/**
 * UI基类
 * 增加绑定dom方法以及show，hide等基础方法
 *
 * @since 0.1
 * @author JJF
 */
define(['eui/base/Base', 'eui/core/clz'], function(Base, clz) {
    var UiBase = clz.define({
        name: 'UiBase',
        parent: Base,
        preConstructor: function(conf) {
            this._bindDom(conf.dom);
        },
        proto: {
            _bindDom: function(dom) {
                this._dom = dom;
                return this
            },
            getDom: function() {
                return this._dom
            },
            show: function() {
                var me = this,
                    d = me.getDom();
                me.fire('beforeshow');
                d.removeClass('hide');
                me.fire('show');
                return me
            },
            hide: function() {
                var me = this,
                    d = me.getDom();
                me.fire('beforehide');
                d.addClass('hide');
                me.fire('hide');
                return me
            },
            destroy: function() {
                this.getDom().remove();
                this.callSuper(Base, 'destroy');
            }
        }
    });

    return UiBase;
});