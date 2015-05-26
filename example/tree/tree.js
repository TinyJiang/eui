define(['eui/eui'], function(eui) {
    var loader = eui.loader({
        url: 'tree.json',
        timeout: 30000,
        type: 'GET',
        autoLoad: true,
        dataType: 'json',
        dataPath: 'data'
    });
    var tree = eui.tree({
        dom: $('#tb'),
        multiSel: true,
        labelIndex: 'fullname',
        autoExpand: true,
        loader: loader
    });

    tree.on('expandNode', function(node) {
        //node.getRecord().set('checked', true);
    }).on('collapseNode', function(node) {
        //console.log(node);
    }).on('selectNode', function(node) {
        // node.getRecord().set('fullname', 'hahahahahahaha');
    })
})