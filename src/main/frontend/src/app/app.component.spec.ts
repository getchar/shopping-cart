/* tslint:disable:no-unused-variable */

import {
    beforeEach, beforeEachProviders,
	describe, xdescribe,
	expect, it, xit,
	async, inject
	} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Product } from './app.component';
import { Basket } from './app.component';
import { Deal } from './app.component';

beforeEachProviders(() => [AppComponent]);

describe('App: Starter', () => {
	it('Should create the app',
	   inject([AppComponent], (app: AppComponent) => {
		   expect(app).toBeTruthy();
	       }));
    });

// Just buy a product, enough times to trigger both of its prices.
describe('Total One Product', () => {
	let basket = new Basket();
	let product1 = new Product("testproduct1", "desc", 3.00, [new Deal(3, 7.00)], "product.jpg", 10000);
	for (var i = 0; i < 4; ++i) {
	    // buy 4 to trigger 1 deal and 1 regular price.
	    basket.buy(product1);
	}
	basket.getTotal();
	it ('Basket should total to sum of all deal prices.', () => {
		expect(basket.total).toEqual(7.00 + 3.00);
	    });
    });

// Try buying two products, enough to trigger all possible prices once.
describe('Total Two Products', () => {
	let basket = new Basket();
	let product1 = new Product("testproduct1", "desc", 3.00, [new Deal(3, 7.00)], "product.jpg", 10000);
	let product2 = new Product("testproduct1", "desc", 5.00, [new Deal(2, 8.00), new Deal(5, 19.00)], "product.jpg", 10000);
	for (var i = 0; i < 4; ++i) {
	    // Buy 4 to trigger 1 deal and 1 regular price.
	    basket.buy(product1);
	}
	for (var i = 0; i < 8; ++i) {
	    // Buy 8 to trigger 1 of each price.
	    basket.buy(product2);
	}
	basket.getTotal();
	it ('Basket should total to sum of all deal prices.', () => {
		expect(basket.total).toEqual(7.00 + 3.00 + 19.00 + 8.00 + 5.00);
	    });
    });

// Buy a product, then unbuy it, and make sure the basket is empty.
describe('Buy, Unbuy, Empty', () => {
	let basket = new Basket();
	let product1 = new Product("testproduct1", "desc", 3.00, [new Deal(3, 7.00)], "product.jpg", 10000);
	basket.buy(product1);
	basket.unbuy(product1);
	it ('Basket should be empty.', () => {
		expect(basket.purchases.length).toEqual(0);
	    });
    });

// Buy a product, then unbuy it, and make sure the total is 0.
describe('Buy, Unbuy, Total is 0', () => {
	let basket = new Basket();
	let product1 = new Product("testproduct1", "desc", 3.00, [new Deal(3, 7.00)], "product.jpg", 10000);
	basket.buy(product1);
	basket.unbuy(product1);
	basket.getTotal();
	it ('Basket total should be 0.', () => {
		expect(basket.total).toEqual(0);
	    });
    });

// Buy a product, then unbuy another, and make sure the original product is still in the cart;
describe('Buy, Unbuy Different, Total First', () => {
	let basket = new Basket();
	let product1 = new Product("testproduct1", "desc", 3.00, [new Deal(3, 7.00)], "product.jpg", 10000);
	let product2 = new Product("testproduct1", "desc", 5.00, [new Deal(2, 8.00), new Deal(5, 19.00)], "product.jpg", 10000);
	basket.buy(product1);
	basket.unbuy(product2);
	basket.getTotal();
	it ("Basket total should be one of product1.", () => {
		expect(basket.total).toEqual(3.00);
	    });
    });

// Start an app, assign a name to the current user.  Make sure there's one user and their name is as given.
describe('Name Anonymous User', () => {
	let app = new AppComponent();
	let username: string = "Bill Lee";
	app.switchTo(username);
	it("Should have one customer.", () => {
		expect(app.customers.length == 1);
	    });
	it("Customer's name should be Bill Lee.", () => {
		expect(app.customer.username == username);
	    });

    });

// Start an app, assign a name to the current user.  Create a new user.  See that there are two users and the current username is correct.
describe('Name Anonymous User', () => {
	let app = new AppComponent();
	let username1: string = "Bill Lee";
	let username2: string = "Clark Nova";
	app.switchTo(username1);
	app.switchTo(username2);
	it("Should have one customer.", () => {
		expect(app.customers.length == 2);
	    });
	it("Current customer's name should be Clark Nova.", () => {
		expect(app.customer.username == username2);
	    });

    });

