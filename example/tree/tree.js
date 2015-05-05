define(['eui/eui'], function(eui) {
    var loader = eui.loader({
        url: 'tree.json',
        timeout: 30000,
        method: 'GET',
        dataType: 'json',
        dataPath: 'data'
    });
    var tree = eui.tree({
        dom: $('#tb'),
        multiSel: false,
        labelIndex: 'fullname',
        autoExpand: true,
        loader: loader
    });

    tree.on('expandNode', function(node) {
        console.log(node);
    }).on('collapseNode', function(node) {
        console.log(node);
    }).on('selectNode', function(node) {
        node.getRecord().set('fullname', 'hahahahahahaha');
    })

    loader.load();
})