'use strict'
/**
 * record纪录模型
 *
 * @event setdata 设置record数据
 * @enent datachange 更改data中的某项值
 * @since 0.1
 * @author JJF
 */
define(['eui/base/Base', 'eui/core/clz', 'eui/core/register'], function(Base, clz, register) {
    /** ----------------类定义-----------------* */

    var Record = clz.define({
        name: 'Record',
        parent: Base,
        preConstructor: function(data) {
            this.setData(data);
        },
        proto: {
            getData: function() {
                return this._getCache('data')
            },
            setData: function(data) {
                this._bindCache('data', data)
                this.fire('setdata', [data])
            },
            get: function(k) {
                var data = this.getData();
                return data ? data[k] : null
            },
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
        record: 'create'
    });


});