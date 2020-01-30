var Widget = (function () {

    var frameId = null;

    return {
        initialize: function (items) {
            pm.bind("register", function (data) {
                frameId = data.frameId;
                pm({
                    target: window.parent,
                    type: frameId,
                    data: items
                });
                Widget.sendHeight($(".im_widget").height() || 600);
            });
        },
        sendHeight: function (height) {
            pm({
                target: window.parent,
                type: "widgetHeight",
                data: { height: height, frameId: frameId }
            });
        },
        recsMissing: function () {
            pm({
                target: window.parent,
                type: "recsMissing",
                data: null
            });
        },
        reloadPage: function () {
            pm({
                target: window.parent,
                type: "reloadPage",
                data: null
            });
        },
        closePopupWidget: function () {
            pm({
                target: window.parent,
                type: "closePopupRecomWidget"
            });
        },
        sendBuy: function (itemId) {
            pm({
                target: window.parent,
                type: "addToBasket",
                data: { itemId: itemId }
            });
        },
        sendAddTobasket: function (itemId, reloadPageOnAddedComplete, alg, dontShowPopup, widgetName, methodName) {
            pm({
                target: window.parent,
                type: "addToBasket",
                data: {
                    itemId: itemId,
                    reloadPageOnAddedComplete: reloadPageOnAddedComplete,
                    alg: alg,
                    dontShowPopup: dontShowPopup,
                    widgetName: widgetName,
                    methodName: methodName
                }
            });
        },
        sendRecomMouseDown: function (itemId, alg, widgetName, methodName) {
            pm({
                target: window.parent,
                type: "widgetRecomMouseDown",
                data: {
                    itemId: itemId,
                    alg: alg,
                    widgetName: widgetName,
                    methodName: methodName
                }
            });
        },
        imageLoadError: function (image) {
            image.onerror = "";
            image.src = "/Content/Img/NoImage-Product.gif";

            var li = $(image).parents("li")[0];
            if (li)
                $(li).hide();

            return true;
        },
        recomMouseDown: function (itemId, alg, widgetName, methodName) {
            Widget.sendRecomMouseDown(itemId, alg, widgetName, methodName);
            return true;
        },
        addToBasket: function (itemId, reloadPageOnAddedComplete, alg, dontShowPopup, widgetName, methodName) {
            Widget.sendAddTobasket(itemId, reloadPageOnAddedComplete, alg, dontShowPopup, widgetName, methodName);
            $(".addToBasket_" + itemId).hide();
            $(".goToBasketButton_" + itemId).removeClass("goToBasketButtonHidden");
            var productBuyButton = $(".product_buy_button_" + itemId);
            if (productBuyButton) productBuyButton.addClass("product_buy_button_visited");
        }
    };
})()