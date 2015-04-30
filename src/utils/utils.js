define([], function() {
    var utils = {
        isObjOf: function(obj, clz) {
            return obj && $.type(obj.isObjOf) == 'function' && obj.isObjOf(clz)
        }
    };
    return utils
});