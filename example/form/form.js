define(['eui/eui'], function(eui) {
    $(function() {
        var loader = eui.loader({
            url: 'test.json',
            autoLoad: true,
            timeout: 30000,
            type: 'GET',
            dataPath: 'data',
            dataType: 'json'
        });
        var combo = eui.combo({
            dom: $('#combo'),
            id: 'combo',
            multiSel: true,
            labelField: 'label',
            valueField: 'value',
            value: '0',
            loader: loader,
            events: {
                select: function(v) {
                    console.log(v)
                }
            }
        });

        var conditiongroup = eui.conditiongroup({
            dom: $('#condition'),
            conditions: [{
                name: 'sex',
                loader: eui.loader({
                    url: 'condition.json',
                    dataPath: 'data'
                }),
                fixedHeight: true,
                value: '',
                label: '性别'
            }, {
                name: 'region',
                loader: eui.loader({
                    url: 'test.json',
                    dataPath: 'data'
                }),
                fixedHeight: true,
                multiSel: true,
                value: '0,5756',
                disabled: false,
                label: '地市'
            }]
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
            console.log('combo:' + combo.getValue());
            console.log('starttime:' + starttime.getValue());
            console.log('endtime:' + endtime.getValue());
            console.log(conditiongroup.getValue())
        })
        $('#set-btn').on('click', function() {
            starttime.setValue('2015-05-10 12:00:00');
            endtime.setValue(new Date());
        })
        $('#update-btn').on('click', function() {

        })

    });
})