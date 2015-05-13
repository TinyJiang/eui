define(['eui/eui'], function(eui) {
    var loader = eui.loader({
        url: 'grid.json',
        timeout: 30000,
        method: 'GET',
        dataType: 'json',
        dataPath: 'data.data'
    });
    var paging = eui.paging({
        dom: $('#paging'),
        pagesize: 20,
        totalPath: 'data.total',
        loader: loader
    });
    var grid = eui.grid({
        dom: $('#tb'),
        multiSel: true,
        loader: loader,
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
                console.log('grid inited')
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
    loader.load({
        start: 0,
        limit: 20
    });


    $('#getCurrentSel').on('click', function() {
        console.log(grid.getCurrentSel());
    });
})