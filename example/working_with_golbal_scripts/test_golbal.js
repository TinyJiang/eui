$(function() {
    var euiMask;
    var initMask = function() {
        if (window.eui) {
            euiMask = eui.mask({
                container: $('#tb')
            });
        } else {
            setTimeout(initMask, 500);
        }
    }
    $('#showmask').on('click', function() {
        euiMask && euiMask.show();
    })
    $('#hidemask').on('click', function() {
        euiMask && euiMask.hide();
    })

    initMask();
})