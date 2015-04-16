'use strict'
/**
 * UI组件基类
 */
define(['eui/base/Base', 'eui/effects/mask'], function(Base, mask) {
    var UiBase = function() {
        Base.apply(this, arguments);
    };
    $.extend(UiBase.prototype, Base.prototype, {
        _init: function(dom, conf) { // 构造函数，需要时重写
            this._bindDomConf(dom, conf);
        },
        _bindDomConf: function(dom, conf) {
            this._bindConf(conf);
            this._dom = dom;
            return this
        },
        getDom: function() {
            return this._dom
        },
        show: function(animation) {
            var me = this,
                d = me.getDom();
            return me
        },
        hide: function(animation) {
            var me = this,
                d = me.getDom();
            return me
        },
        destroy: function() {},
        controlLoadMask: function(isMask) {}
    });
    return UiBase;
});