'use strict'
/**
 * @class UiBase
 * @memberof base
 * @extends base.Base
 * @description UI基类，增加绑定dom方法以及show，hide等基础方法
 * @inheritdoc
 * @since 0.1
 * @author JJF
 */
define(['eui/base/Base', 'eui/core/clz', 'eui/utils/utils'], function(Base, clz, utils) {
    var UiBase = clz.define({
        name: 'UiBase',
        parent: Base,
        /** 
         * @memberOf base.UiBase
         * @private
         * @method preConstructor
         * @description 执行绑定dom操作
         * @fires init
         */
        preConstructor: function(conf) {
            this._bindDom(conf.dom);
        },
        proto:
        /** @lends base.UiBase.prototype */
        {
            /** 
             * @private
             * @param {Object} dom jquerydom对象
             * @description 绑定dom
             */
            _bindDom: function(dom) {
                this._dom = dom;
                return this
            },
            /** 
             * @description 获取绑定在当前对象上的dom
             * @return {Object} 绑定的jquery dom对象
             */
            getDom: function() {
                return this._dom
            },
            /** 
             * @description 显示
             * @return {Object} 返回当前对象，支持链式调用
             */
            show: function() {
                var me = this,
                    d = me.getDom();
                me.fire('beforeshow');
                d.removeClass('hide');
                me.fire('show');
                return me
            },
            /** 
             * @description 隐藏
             * @return {Object} 返回当前对象，支持链式调用
             */
            hide: function() {
                var me = this,
                    d = me.getDom();
                me.fire('beforehide');
                d.addClass('hide');
                me.fire('hide');
                return me
            },
            /** 
             * @override
             * @description 销毁
             */
            destroy: function() {
                this.getDom().remove();
                utils.callProto(Base, 'destroy', [], this);
            }
        }
    });

    return UiBase;
});