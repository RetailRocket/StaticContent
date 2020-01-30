(function ($) {
    $.fn.searchCategory = function (config) {
        var searchInput = this;
        var idInput = $(config.idInput);
        searchInput.autocomplete({
            source: config.categories,
            minLength: 3,
            focus: function (event, ui) {
                event.preventDefault();
                searchInput.val(ui.item.label);
                return false;
            },
            select: function (event, ui) {
                event.preventDefault();
                searchInput.val(ui.item.label);
                idInput.val(ui.item.value).change();
            }
        });
        searchInput.change(function () {
            if (!searchInput.val())
                idInput.val("").change();
        });
    };
}(jQuery));
