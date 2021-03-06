define(['eui/eui', 'text!bodyTpl.html'], function(eui, bodyTpl) {
    var win = eui.window({
        title: '测试',
        content: eui.utils.renderTpl(bodyTpl, {}),
        btns: [{
            text: '关闭',
            cls: 'btn-default',
            handler: function() {
                this.hide();
            }
        }, {
            text: '提交',
            cls: 'btn-primary',
            handler: function() {}
        }],
        events: {
            show: function() {
                console.log('show')
            },
            hide: function() {
                console.log('hide')
            }
        }
    });

    var loader = eui.loader({
        autoLoad: true,
        dataPath: 'data',
        local: true,
        localData: {
            data: [{
                v: 'value1',
                n: 'name1'
            }, {
                v: 'value2',
                n: 'name2'
            }, {
                v: 'value3',
                n: 'name3'
            }, {
                v: 'value4',
                n: 'name4'
            }, {
                v: 'value5',
                n: 'name5'
            }, {
                v: 'value6',
                n: 'name6'
            }]
        }
    });
    var combo = eui.combo({
        dom: $('#combo'),
        multiSel: true,
        labelField: 'n',
        valueField: 'v',
        value: 'value1,value2',
        loader: loader
    });

    var starttime = eui.datetime({
        dom: $('#starttime'),
        id: 'starttime',
        endTimePicker: 'endtime'
    });

    var endtime = eui.datetime({
        dom: $('#endtime'),
        id: 'endtime',
        startTimePicker: 'starttime'
    });

    $('#btn').on('click', function() {
        win.show();
    })

    $('#destroy').on('click', function() {
        win.destroy();
    })
});