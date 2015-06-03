'use strict'
define(['eui/base/Base', 'eui/core/clz', 'eui/core/register'], function(Base, clz, register) {
    var CACHE_KEYS = {
        CHANGED: 'CHANGED',
        DATA: 'DATA'
    };

    /** ----------------类定义-----------------* */

    var Record = clz.define({
        name: 'Record',
        parent: Base,
        preConstructor: function(data) {
            this.setData(data);
            return [{}]
        },
        proto:
        /** @lends data.Record.prototype */
        {
            /** 
             * @description 获取数据对象
             * @return {Object} data 数据对象
             */
            getData: function() {
                return this._getCache(CACHE_KEYS.DATA)
            },
            /** 
             * @description 设置数据对象
             * @param {Object} data 数据对象
             * @fires setdata
             */
            setData: function(data) {
                this._bindCache(CACHE_KEYS.DATA, data)
                this.fire('setdata', [data])
            },
            /** 
             * @description 获取数据对象中指定key值的value
             * @param {Object} k key值
             * @return {Object} val 与k对应的value值
             */
            get: function(k) {
                var data = this.getData();
                return data ? data[k] : null
            },
            /** 
             * @description 设置数据对象中指定key值的value
             * @param {Object} k key值
             * @param {Object} v value值
             * @fires datachange
             */
            set: function(k, v) {
                var data = this.getData();
                if (!data) {
                    data = {};
                }
                if (data[k] !== v) {
                    data[k] = v;
                    this._bindCache(CACHE_KEYS.DATA, data)
                    this.fire('datachange', [k, v, data]);
                    this._bindCache(CACHE_KEYS.CHANGED, true);
                }
            },
            /** 
             * @description 返回是否被set改变过对象中的值
             * @return {Boolean}
             */
            hasChanged: function() {
                var changed = this._getCache(CACHE_KEYS.CHANGED);
                return changed === undefined ? false : changed
            },
            /** 
             * @description 重置对象更改状态，将会把更改状态转化为false
             */
            persist: function() {
                this._bindCache(CACHE_KEYS.CHANGED, false);
            },
            /** 
             * @description 遍历每个key值
             * @param {eachCallback} cb 回调函数
             * @param {Object} [scope=record] 回调执行的scope
             */

            /**
             * @callback eachCallback
             * @param {Object} k key值
             * @param {Object} v value值
             */
            forEach: function(cb, scope) {
                var me = this,
                    data = this.getData();
                if (data) {
                    for (var i in data) {
                        if (data.hasOwnProperty(i)) {
                            cb.apply(scope || me, [i, data[i]]);
                        }
                    };
                }
            }
        }
    });

    return register(Record, {
        /**
         * @constructor Record
         * @memberof data
         * @desc record纪录模型，挂载至eui.record(data)
         * @extends base.Base
         * @since 0.1
         * @author JJF
         * @param {Object} data 数据对象
         */
        record: 'create'
    });


});