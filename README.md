# eui

eui是`事件驱动`的bootstrap前端组件库。

需要global依赖
> * jquery
> * bootstrap
> * mustache

[API文档库](http://10.8.132.221:8090/display/BASEFRAME01/eui)
--------------


##HOW TO USE
1. 在jsp中依次加入增加jquery，bootstrap，fontawesome，eui依赖
2. 定义data－main的js路径
3. 入口js中eui引用id为"eui/eui"


```	html

<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="shiro" uri="http://shiro.apache.org/tags"%>
<%
	response.setHeader("X-UA-Compatible", "IE=edge");
%>
<!DOCTYPE html>
<html>
<head>
<%@ include file="/common/lib.jsp"%>
<%@ include file="/common/bootstrap.jsp"%>
<%@ include file="/common/fontawesome/fontawesome4.3.0.jsp"%>
<%@ include file="/common/eui.jsp"%>
<c:set var="mainJs" value="${ctx}/tree" />
<%@ include file="/common/require.jsp"%>
<style type="text/css">
	.tb{
		height:300px;
		width:300px;
	}
</style>
</head>
<body>
	<div class="tb" id="tb"></div>
</body>
</html>

```


``` javascript

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