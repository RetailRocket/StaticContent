/* global rrLibrary */

var rrApiStub = { // eslint-disable-line no-unused-vars
    _initialize: {
        subscribe: function (func)
        {
            func({ sessionId: 'FAKE-SESSION-ID' });
        }
    },
    view: rrLibrary.EventProperty(), // eslint-disable-line new-cap
    addToBasket: rrLibrary.EventProperty(), // eslint-disable-line new-cap
    removeFromBasket: rrLibrary.EventProperty(), // eslint-disable-line new-cap
    removeFromBasketCompleted: rrLibrary.EventProperty(), // eslint-disable-line new-cap
    categoryView: rrLibrary.EventProperty(), // eslint-disable-line new-cap
    addToBasketCompleted: rrLibrary.EventProperty(), // eslint-disable-line new-cap
    recomMouseDown: rrLibrary.EventProperty(), // eslint-disable-line new-cap
    setEmail: rrLibrary.EventProperty(), // eslint-disable-line new-cap
    mailRequest: rrLibrary.EventProperty(), // eslint-disable-line new-cap
    mailRequestFormView: rrLibrary.EventProperty(), // eslint-disable-line new-cap
    groupView: rrLibrary.EventProperty(), // eslint-disable-line new-cap
    recomAddToCart: rrLibrary.EventProperty(), // eslint-disable-line new-cap
    recomAddToCartCompleted: rrLibrary.EventProperty(), // eslint-disable-line new-cap
    recomTrack: rrLibrary.EventProperty(), // eslint-disable-line new-cap
    order: rrLibrary.EventProperty(), // eslint-disable-line new-cap
    recomMouseDownCompleted: rrLibrary.EventProperty(), // eslint-disable-line new-cap
    subscribeOnItemBackInStock: rrLibrary.EventProperty(), // eslint-disable-line new-cap
    welcomeSequence: rrLibrary.EventProperty(), // eslint-disable-line new-cap
    search: rrLibrary.EventProperty(), // eslint-disable-line new-cap
    subscribeOnPriceDrop: rrLibrary.EventProperty() // eslint-disable-line new-cap
};
