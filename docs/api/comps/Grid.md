# Grid表格

-----

## Sample Code
``` javascript
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
```

## Configs

	### dom(jQuery Object)
		将grid渲染至该dom中，一般为div，样式可自行指定
	### multiSel(Boolean)
		是否允许多选，默认false
	### loader([Loader]())
		数据加载器
	### columns(Array(ColumnConfig))

## Methods

## Events