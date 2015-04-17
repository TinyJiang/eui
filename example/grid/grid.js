define(['eui/eui'], function(eui) {
    var grid = eui.grid($('#tb'), {
        pagesize: 20,
        multiSel: true,
        loader: {
            url: 'grid.json',
            timeout: 30000,
            method: 'GET',
            dataType: 'json',
            dataPath: 'data'
        },
        dataIndex: null,
        columns: [{
            header: 'ID',
            index: 'id',
            align: 'center',
            width: 120
        }, {
            header: '用户名',
            index: 'username',
            flex: 1
        }, {
            header: '中文名',
            index: 'fullname',
            flex: 1
        }, {
            header: '状态',
            index: 'status',
            width: 80,
            render: function(val) {
                var label_class = val == 'true' ? 'label-success' : 'label-danger';
                return '<label class="label ' + label_class + '">' + val + '</label>'
            }
        }],
        events: {
            init: function() {
                console.log(1)
            }
        }
    });
    grid.on('select', function(linedata) {
        console.log(linedata);
    }).on('unselect', function(linedata) {
        console.log(linedata);
    }).on('cellclick', function(data) {
        console.log(data);
    })
    grid.getLoader().load();
})