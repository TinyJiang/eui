# eui与echart兼容性问题解决方案
---

## 原因
echarts自带一套amd解决方案els并且在requirejs的amd方案下无法执行，会出现路径解析不正确等错误


## 解决方案一
使用echarts-all单文件非amd模式引入

``` javascript

require.config({
		paths : {
			'jquery' : eastcom.baseURL
					+ '/static/jslib/jquery-1.7.2/jquery-1.7.2.min',
			'scripts' : eastcom.baseURL + '/scripts',
			'echarts' : eastcom.baseURL+'/static/jslib/echarts/echarts-all',
			'eui' : eastcom.baseURL + '/static/jslib/eui/0.1',
			'text':eastcom.baseURL + '/static/jslib/requireJs/plugins/text'//text plugin
		},
		shim: {
	        echarts: {
	            exports: "echarts"
	        }
	    }
	});
```

### 示例代码

``` html
<%@ page language="java" pageEncoding="UTF-8"%>
<%
 request.setCharacterEncoding("UTF-8");
%>
<!DOCTYPE HTML>
<html>
	<head>
		<%@ include file="/common/lib.jsp"%>
		<%@ include file="/common/bootstrap.jsp"%>
		<%@ include file="/common/fontawesome/fontawesome4.3.0.jsp"%>
		<%@ include file="/common/eui.jsp"%>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<c:set var="mainJs" value="test" />
		<%@ include file="/common/require.jsp"%>
	</head>
	<body>	
		<div id="cnt" style="height:500px;width:700px"></div>
		<div id="cnt2" style="height:500px;width:700px"></div>
	</body>
</html>
```

``` javascript

define(['echarts', 'eui/eui'], function(ec, eui) {
			var myChart = ec.init(document.getElementById('cnt'));
			var option = {
				title : {
					text : '未来一周气温变化',
					subtext : '纯属虚构'
				},
				tooltip : {
					trigger : 'axis'
				},
				legend : {
					data : ['最高气温', '最低气温']
				},
				toolbox : {
					show : true,
					feature : {
						mark : {
							show : true
						},
						dataView : {
							show : true,
							readOnly : false
						},
						magicType : {
							show : true,
							type : ['line', 'bar']
						},
						restore : {
							show : true
						},
						saveAsImage : {
							show : true
						}
					}
				},
				calculable : true,
				xAxis : [{
							type : 'category',
							boundaryGap : false,
							data : ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
						}],
				yAxis : [{
							type : 'value',
							axisLabel : {
								formatter : '{value} °C'
							}
						}],
				series : [{
							name : '最高气温',
							type : 'line',
							data : [11, 11, 15, 13, 12, 13, 10],
							markPoint : {
								data : [{
											type : 'max',
											name : '最大值'
										}, {
											type : 'min',
											name : '最小值'
										}]
							},
							markLine : {
								data : [{
											type : 'average',
											name : '平均值'
										}]
							}
						}, {
							name : '最低气温',
							type : 'line',
							data : [1, -2, 2, 5, 3, 2, 0],
							markPoint : {
								data : [{
											name : '周最低',
											value : -2,
											xAxis : 1,
											yAxis : -1.5
										}]
							},
							markLine : {
								data : [{
											type : 'average',
											name : '平均值'
										}]
							}
						}]
			};
			myChart.setOption(option);

			var loader = eui.loader({
						url : 'tree.json',
						timeout : 30000,
						method : 'GET',
						dataType : 'json',
						dataPath : 'data'
					});
			var tree = eui.tree({
						dom : $('#cnt2'),
						multiSel : true,
						labelIndex : 'fullname',
						autoExpand : true,
						loader : loader
					});

			tree.on('expandNode', function(node) {
						node.getRecord().set('checked', true);
					}).on('collapseNode', function(node) {
						console.log(node);
					}).on('selectNode', function(node) {
						// node.getRecord().set('fullname', 'hahahahahahaha');
					})

			loader.load();

		});
```


## 解决方案二
使用echart带的els的amd而不使用requirejs

### 示例代码
``` html
<%@ page language="java" pageEncoding="UTF-8"%>
<%
 request.setCharacterEncoding("UTF-8");
%>
<!DOCTYPE HTML>
<html>
	<head>
		<%@ include file="/common/lib.jsp"%>
		<%@ include file="/common/bootstrap.jsp"%>
		<%@ include file="/common/fontawesome/fontawesome4.3.0.jsp"%>
		<%@ include file="/common/eui.jsp"%>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<%@ include file="/common/echarts.jsp"%>
	</head>
	<body>	
		<div id="cnt" style="height:500px;width:700px"></div>
		<div id="cnt2" style="height:500px;width:700px"></div>
		<script type="text/javascript">
			require(['test'])
		</script>
	</body>
</html>
```

``` javascript

define(['echarts/echarts', 'echarts/chart/line', 'echarts/chart/bar',
				'eui/eui'], function(ec, line, bar, eui) {
			var myChart = ec.init(document.getElementById('cnt'));
			var option = {
				title : {
					text : '未来一周气温变化',
					subtext : '纯属虚构'
				},
				tooltip : {
					trigger : 'axis'
				},
				legend : {
					data : ['最高气温', '最低气温']
				},
				toolbox : {
					show : true,
					feature : {
						mark : {
							show : true
						},
						dataView : {
							show : true,
							readOnly : false
						},
						magicType : {
							show : true,
							type : ['line', 'bar']
						},
						restore : {
							show : true
						},
						saveAsImage : {
							show : true
						}
					}
				},
				calculable : true,
				xAxis : [{
							type : 'category',
							boundaryGap : false,
							data : ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
						}],
				yAxis : [{
							type : 'value',
							axisLabel : {
								formatter : '{value} °C'
							}
						}],
				series : [{
							name : '最高气温',
							type : 'line',
							data : [11, 11, 15, 13, 12, 13, 10],
							markPoint : {
								data : [{
											type : 'max',
											name : '最大值'
										}, {
											type : 'min',
											name : '最小值'
										}]
							},
							markLine : {
								data : [{
											type : 'average',
											name : '平均值'
										}]
							}
						}, {
							name : '最低气温',
							type : 'line',
							data : [1, -2, 2, 5, 3, 2, 0],
							markPoint : {
								data : [{
											name : '周最低',
											value : -2,
											xAxis : 1,
											yAxis : -1.5
										}]
							},
							markLine : {
								data : [{
											type : 'average',
											name : '平均值'
										}]
							}
						}]
			};
			myChart.setOption(option);

			var loader = eui.loader({
						url : 'tree.json',
						timeout : 30000,
						method : 'GET',
						dataType : 'json',
						dataPath : 'data'
					});
			var tree = eui.tree({
						dom : $('#cnt2'),
						multiSel : true,
						labelIndex : 'fullname',
						autoExpand : true,
						loader : loader
					});

			tree.on('expandNode', function(node) {
						node.getRecord().set('checked', true);
					}).on('collapseNode', function(node) {
						console.log(node);
					}).on('selectNode', function(node) {
						// node.getRecord().set('fullname', 'hahahahahahaha');
					})

			loader.load();

		});
```