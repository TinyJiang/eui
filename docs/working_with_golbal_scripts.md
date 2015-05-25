# 非模块化代码中使用eui解决方案
---


## 解决方案

### 使用模块化的方式将eui引入当前html中
``` html
<script type="text/javascript" src="../../lib/requirejs/require.js" data-main="test_module"></script>
	<script type="text/javascript">
		require.config({
			paths : {
				'eui' : '../../src',
				'text':'../../lib/requirejs/plugins/text',//text plugin
				'datetimepicker':'../../src/plugin/datetimepicker/bootstrap-datetimepicker',
				'moment':'../../src/plugin/moment/moment-with-locales.min'
			}
		});
</script>

```

### 在入口模块中将eui绑定之window全局变量
``` javascript
define(['eui/eui'], function(eui) {
    window.eui = eui;
})
```

### 在其他非模块化代码中使用eui全局变量调用eui方法

``` javascript
var initMask = function() {
        if (window.eui) {
            euiMask = eui.mask({
                container: $('#tb')
            });
        } else {
            setTimeout(initMask, 500);
        }
    }
```

`注意：在调用eui之前必须先判断eui的模块代码是否已经加载并执行完成，用window.eui检测`

### [实例](../../example/working_with_golbal_scripts/test.html)