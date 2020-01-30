(function ($) {

    $.fn.optionalFormBlock = function (config) {
        var formBlock = this,
            watchedInput = $(config.watchedInput),
            showValues = config.showValues;

        function render() {
            var idx = $.inArray(watchedInput.val(), showValues);
            if (idx >= 0) {
                formBlock.show();
            } else {
                formBlock.hide();
            }
        }

        watchedInput.change(render);

        render();
    };

}(jQuery));
