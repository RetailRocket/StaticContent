(function ($) {

    $.fn.searchProduct = function (config) {
        var searchInput = this;
        $(searchInput).change(function () {
            var checkerImg = $(config.ImgCheckerElement);
            $(config.idInput).val(null);
            checkerImg.removeClass('hidden');
            var offerId = $(searchInput).val();
            if (offerId == "") {
                hideCheckerImg(checkerImg);
                return false;
            }
            if (!$.isNumeric(offerId)) {
                setCheckerImgNotOk(checkerImg, config.failureMessage);
                return false;
            }
            setCheckerImgLoading(checkerImg, config.checkingMessage);
            $.ajax({
                url: config.actionUrl,
                type: "GET",
                data: { offerId: offerId },
                success: function (result) {
                    if (!result) {
                        setCheckerImgNotOk(checkerImg, config.failureMessage);
                        return false;
                    }
                    $(config.idInput).val(offerId);
                    $(searchInput).val(result + " Id=" + offerId);
                    setCheckerImgOk(checkerImg, config.successMessage);
                },
                error: function () {
                    setCheckerImgNotOk(checkerImg, config.failureMessage);
                }
            });
        });
    };
    function setCheckerImgOk(checkerImg, message) {
        checkerImg.removeClass();
        checkerImg.addClass('control-label glyphicon glyphicon-ok text-success');
        checkerImg.attr("title", message);
    }

    function setCheckerImgNotOk(checkerImg, message) {
        checkerImg.removeClass();
        checkerImg.addClass('control-label glyphicon glyphicon-remove text-danger');
        checkerImg.attr("title", message);
    }

    function setCheckerImgLoading(checkerImg, message) {
        checkerImg.removeClass();
        checkerImg.addClass('control-label glyphicon glyphicon-refresh');
        checkerImg.attr("title", message);
    }

    function hideCheckerImg(checkerImg) {
        checkerImg.removeClass();
        checkerImg.addClass('hidden');
    }
}(jQuery));
