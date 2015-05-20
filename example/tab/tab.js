define(['eui/eui'], function(eui) {
    var tab = eui.tab({
        dom: $('#tab'),
        tabs: [{
            id: 'tab1',
            active: true,
            text: 'tab1'
        }, {
            id: 'tab2',
            text: 'tab2'
        }]
    });
});