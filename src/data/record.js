'use strict'
define(['eui/base/Base', 'eui/core/clz', 'eui/core/register'], function(Base, clz, register) {
    /** ----------------类定义-----------------* */

    var Record = clz.define({
        name: 'Record',
        parent: Base,
        preConstructor: function(data) {
            this.setData(data);
        },
        proto:
        /** @lends record.prototype */
        {
            /** 
             * @description 获取数据对象
             * @return {Object} data 数据对象
             */
            getData: function() {
                return this._getCache('data')
            },
            /** 
             * @description 设置数据对象
             * @param {Object} data 数据对象
             * @fires setdata
             */
            setData: function(data) {
                this._bindCache('data', data)
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
                data[k] = v;
                this._bindCache('data', data)
                this.fire('datachange', [k, v, data])
            }
        }
    });

    return register(Record, {
        /**
         * @constructor record
         * @desc record纪录模型，挂载至eui.record(data)
         * @extends Base
         * @since 0.1
         * @author JJF
         * @param {Object} data 数据对象
         */
        record: 'create'
    });


});