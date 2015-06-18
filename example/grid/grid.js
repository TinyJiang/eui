define(['eui/eui'], function(eui) {
    var loader = eui.loader({
        url: 'grid.json',
        timeout: 30000,
        type: 'POST',
        dataType: 'json',
        dataPath: 'data.data',
        events: {}
    });
    var paging = eui.paging({
        dom: $('#paging'),
        pagesize: 20,
        totalPath: 'data.total',
        loader: loader
    });
    var editor = eui.grideditor({
        enabled: false,
        events: {
            editcomplete: function(record) {
                console.log(record);
            }
        }
    });
    var grid = eui.grid({
        dom: $('#tb'),
        multiSel: true,
        loader: loader,
        plugins: [editor],
        columns: [{
            header: 'ID',
            index: 'id',
            align: 'center',
            width: 40,
            editable: false
        }, {
            header: '名字',
            align: 'center',
            columns: [{
                header: '用户名',
                align: 'center',
                index: 'username',
                flex: 1
            }, {
                header: '中文名',
                align: 'center',
                index: 'fullname',
                flex: 1
            }]
        }, {
            header: '状态',
            align: 'center',
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
    grid.on('select', function(linedata, e) {
        console.log(linedata);
        if ($.type(linedata) == 'array') {
            console.log('select ' + linedata.length + ' lines ');
        } else {
            console.log('select line ' + linedata.lineIndex);
        }
    }).on('unselect', function(linedata) {
        if ($.type(linedata) == 'array') {
            console.log('unselect ' + linedata.length + ' lines ');
        } else {
            console.log('unselect line ' + linedata.lineIndex);
        }
    }).on('cellclick', function(data, e) {
        console.log(data);
        console.log('click line ' + data.lineIndex + ' cell ' + data.cellIndex);
    })
    loader.load({
        start: 0,
        limit: 20
    });

    var editor2 = eui.grideditor({
        enabled: false,
        events: {
            editcomplete: function(record) {}
        }
    });


    var grid2 = eui.grid({
        dom: $('#tb2'),
        multiSel: true,
        loader: eui.loader({
            url: 'grid2.json',
            timeout: 30000,
            type: 'POST',
            dataType: 'json',
            dataPath: 'data',
            events: {}
        }),
        columns: [{
            header: 'lv1',
            index: 'level1',
            align: 'center',
            width: 100,
            editable: false
        }, {
            header: 'lv2',
            align: 'center',
            index: 'level2',
            flex: 1
        }],
        plugins: [editor2]
    });
    grid2.getLoader().load();

    $('#getCurrentSel').on('click', function() {
        console.log(grid.getCurrentSel());
    });

    $('#startEdit').on('click', function() {
        editor.enable()
        editor2.enable()
    });

    $('#submitEdit').on('click', function() {
        var changed = loader.getChanged();
        console.log(changed);
        loader.clearChanged();
        editor.disable();



        editor2.disable();
    });
})