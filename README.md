## OVERVIEW

eui是`事件驱动`的bootstrap前端组件库。

需要global依赖
> * jquery
> * bootstrap
> * mustache

---

## BUGS AND FEATURES
在ISSUES提交问题。

---

## QUICK START
1. eui需要全局依赖jquery，bootstrap，fontawesome
2. 定义data－main的js路径
3. 入口js中eui引用id为"eui/eui"
asdf

``` javascript

define(['eui/eui'], function(eui) {
    var loader = eui.loader({
        url: 'tree.json',
        timeout: 30000,
        type: 'GET',
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
        node.getRecord().set('checked', true);
    }).on('collapseNode', function(node) {
        console.log(node);
    }).on('selectNode', function(node) {
       //node.getRecord().set('fullname', 'hahahahahahaha');
    })

    loader.load();
})

```

``` javascript

{
    "success": "true",
    "message": "load complete",
    "data": [{
        "id": "dept1",
        "name": "dept1",
        "fullname": "部门1",
        "children": [{
            "id": "user1",
            "name": "user1",
            "fullname": "员工1"
        }, {
            "id": "user2",
            "name": "user2",
            "fullname": "员工2"
        }, {
            "id": "user3",
            "name": "user3",
            "fullname": "员工3"
        }, {
            "id": "user4",
            "name": "user4",
            "fullname": "员工4"
        }]
    }, {
        "id": "dept2",
        "name": "dept2",
        "fullname": "部门2",
        "children": [{
            "id": "user5",
            "name": "user5",
            "fullname": "员工5",
            "children": [{
                "id": "attr1",
                "name": "attr1",
                "fullname": "属性1"
            }, {
                "id": "attr2",
                "name": "attr2",
                "fullname": "属性2"
            }]
        }, {
            "id": "user6",
            "name": "user6",
            "fullname": "员工6"
        }, {
            "id": "user7",
            "name": "user7",
            "fullname": "员工7"
        }, {
            "id": "user8",
            "name": "user8",
            "fullname": "员工8"
        }]
    }, {
        "id": "dept3",
        "name": "dept3",
        "fullname": "部门3",
        "leaf": true
    }]
}

```