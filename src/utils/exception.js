'use strict'
/**
 * 异常处理中心
 *
 * @since 0.1
 * @author JJF
 */
define(['eui/utils/string'], function(string) {
    var exceptions = {
        IllegalArgumentException: function(args) {
            var arg_name = args[0],
                arg_val = args[1],
                need_type = args[2];
            this.message = 'The argment ' + arg_name + ': ' + arg_val + ' is illegal. ';
            if (string.isNotBlank(need_type)) {
                this.message += 'It should be ' + need_type;
            }
        },
        NotFoundException: function(args) {
            var name = args[0],
                inobj = args[1];
            this.message = 'Can not find ' + name;
            if (string.isNotBlank(inobj)) {
                this.message += ' in ' + inobj;
            }
        },
        AjaxException: function(args) {
            var jqXHR = args[0],
                textStatus = args[1],
                errorThrown = args[2];
            this.message = 'Ajax error: textStatus = ' + textStatus + '. errorThrown = ' + errorThrown;
        }
    };

    return {
        throwException: function(name, args) {
            var E_obj = exceptions[name],
                e;
            if (E_obj) {
                e = new E_obj(args);
            } else {
                e = new exceptions.NotFoundException([name,
                    'exceptions'
                ]);
            }
            e.toString = function() {
                return e.message
            }
            throw e;
        }
    }
});