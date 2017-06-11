/* tslint:disable:no-unused-variable */
"use strict";
var testing_1 = require('@angular/core/testing');
var app_component_1 = require('./app.component');
var app_component_2 = require('./app.component');
var app_component_3 = require('./app.component');
var app_component_4 = require('./app.component');
testing_1.beforeEachProviders(function () { return [app_component_1.AppComponent]; });
testing_1.describe('App: Starter', function () {
    testing_1.it('Should create the app', testing_1.inject([app_component_1.AppComponent], function (app) {
        testing_1.expect(app).toBeTruthy();
    }));
});
// Just buy a product, enough times to trigger both of its prices.
testing_1.describe('Total One Product', function () {
    var basket = new app_component_3.Basket();
    var product1 = new app_component_2.Product("testproduct1", "desc", 3.00, [new app_component_4.Deal(3, 7.00)], "product.jpg", 10000);
    for (var i = 0; i < 4; ++i) {
        // buy 4 to trigger 1 deal and 1 regular price.
        basket.buy(product1);
    }
    basket.getTotal();
    testing_1.it('Basket should total to sum of all deal prices.', function () {
        testing_1.expect(basket.total).toEqual(7.00 + 3.00);
    });
});
// Try buying two products, enough to trigger all possible prices once.
testing_1.describe('Total Two Products', function () {
    var basket = new app_component_3.Basket();
    var product1 = new app_component_2.Product("testproduct1", "desc", 3.00, [new app_component_4.Deal(3, 7.00)], "product.jpg", 10000);
    var product2 = new app_component_2.Product("testproduct1", "desc", 5.00, [new app_component_4.Deal(2, 8.00), new app_component_4.Deal(5, 19.00)], "product.jpg", 10000);
    for (var i = 0; i < 4; ++i) {
        // Buy 4 to trigger 1 deal and 1 regular price.
        basket.buy(product1);
    }
    for (var i = 0; i < 8; ++i) {
        // Buy 8 to trigger 1 of each price.
        basket.buy(product2);
    }
    basket.getTotal();
    testing_1.it('Basket should total to sum of all deal prices.', function () {
        testing_1.expect(basket.total).toEqual(7.00 + 3.00 + 19.00 + 8.00 + 5.00);
    });
});
// Buy a product, then unbuy it, and make sure the basket is empty.
testing_1.describe('Buy, Unbuy, Empty', function () {
    var basket = new app_component_3.Basket();
    var product1 = new app_component_2.Product("testproduct1", "desc", 3.00, [new app_component_4.Deal(3, 7.00)], "product.jpg", 10000);
    basket.buy(product1);
    basket.unbuy(product1);
    testing_1.it('Basket should be empty.', function () {
        testing_1.expect(basket.purchases.length).toEqual(0);
    });
});
// Buy a product, then unbuy it, and make sure the total is 0.
testing_1.describe('Buy, Unbuy, Total is 0', function () {
    var basket = new app_component_3.Basket();
    var product1 = new app_component_2.Product("testproduct1", "desc", 3.00, [new app_component_4.Deal(3, 7.00)], "product.jpg", 10000);
    basket.buy(product1);
    basket.unbuy(product1);
    basket.getTotal();
    testing_1.it('Basket total should be 0.', function () {
        testing_1.expect(basket.total).toEqual(0);
    });
});
// Buy a product, then unbuy another, and make sure the original product is still in the cart;
testing_1.describe('Buy, Unbuy Different, Total First', function () {
    var basket = new app_component_3.Basket();
    var product1 = new app_component_2.Product("testproduct1", "desc", 3.00, [new app_component_4.Deal(3, 7.00)], "product.jpg", 10000);
    var product2 = new app_component_2.Product("testproduct1", "desc", 5.00, [new app_component_4.Deal(2, 8.00), new app_component_4.Deal(5, 19.00)], "product.jpg", 10000);
    basket.buy(product1);
    basket.unbuy(product2);
    basket.getTotal();
    testing_1.it("Basket total should be one of product1.", function () {
        testing_1.expect(basket.total).toEqual(3.00);
    });
});
// Start an app, assign a name to the current user.  Make sure there's one user and their name is as given.
testing_1.describe('Name Anonymous User', function () {
    var app = new app_component_1.AppComponent();
    var username = "Bill Lee";
    app.switchTo(username);
    testing_1.it("Should have one customer.", function () {
        testing_1.expect(app.customers.length == 1);
    });
    testing_1.it("Customer's name should be Bill Lee.", function () {
        testing_1.expect(app.customer.username == username);
    });
});
// Start an app, assign a name to the current user.  Create a new user.  See that there are two users and the current username is correct.
testing_1.describe('Name Anonymous User', function () {
    var app = new app_component_1.AppComponent();
    var username1 = "Bill Lee";
    var username2 = "Clark Nova";
    app.switchTo(username1);
    app.switchTo(username2);
    testing_1.it("Should have one customer.", function () {
        testing_1.expect(app.customers.length == 2);
    });
    testing_1.it("Current customer's name should be Clark Nova.", function () {
        testing_1.expect(app.customer.username == username2);
    });
});
//# sourceMappingURL=app.component.spec.js.map