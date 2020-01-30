(function ($) {

    $.fn.categoryTree = function (config) {
        var treeHolder = this,
            categoryIdInput = $(config.categoryIdInput);
        
        function renderSubtree(categoryId, postfix) {
            if (!categoryId) {
                treeHolder.hide();
                return;
            }
            treeHolder.show();
            $.get(config.treeUrl + '?categoryId=' + categoryId + "&postfix=" + postfix, function (data) { treeHolder.html(data); });
        }

        categoryIdInput.change(function () {
            renderSubtree(categoryIdInput.val(), config.postfix);
        });

        renderSubtree(categoryIdInput.val(), config.postfix);
    };

}(jQuery));
