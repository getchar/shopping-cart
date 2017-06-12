"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var AppComponent = (function () {
    function AppComponent() {
        this.title = "Crazy Charlie's House of Deals";
        this.products = PRODUCTS;
        // The customer whose basket will appear on the screen.
        this.customer = new Customer("");
        // All known customers.  Begins lifecycle empty.
        this.customers = [this.customer];
    }
    // Switch to the customer whose username was entered.
    // If no such customer doesn't exist, create one.
    // AppComponent initialized with anonymous customer; if that is the current
    // customer, assign name to it but leave basket as is.
    AppComponent.prototype.switchTo = function (username) {
        if (!username) {
            // Don't create a customer with an empty username.
            return;
        }
        if (!this.customer.username) {
            // If the current customer is anonymous, give it the input name.
            this.customer.username = username;
            return;
        }
        for (var i = 0; i < this.customers.length; ++i) {
            // Search through known customers for input username; switch to that customer.
            if (this.customers[i].username === username) {
                this.customer = this.customers[i];
                return;
            }
        }
        // If there is no customer with that name, create a new customer.
        this.customer = new Customer(username);
        this.customers.push(this.customer);
    };
    // Check to see if the product is in stock, then let the customer buy it.
    AppComponent.prototype.buy = function (product) {
        if (product.inventory > 0) {
            product.inventory -= 1;
            this.customer.basket.buy(product);
        }
    };
    // Let the customer unbuy the product.  If the customer has an item to return,
    // add it back to the inventory.
    AppComponent.prototype.unbuy = function (product) {
        product.inventory += this.customer.basket.unbuy(product);
    };
    // Print price in the German style.
    AppComponent.prototype.prettyPrice = function (price) {
        return price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
    };
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'dl-root',
            templateUrl: 'app.component.html',
            styleUrls: ['app.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
// This class stores information about price per number of units.
var Deal = (function () {
    function Deal(count, price) {
        this.count = count;
        this.price = price;
    }
    return Deal;
}());
exports.Deal = Deal;
// This class stores information about the products in the store.
var Product = (function () {
    function Product(name, snippet, price, deals, imgsrc, inventory) {
        this.id = Product.id_base++;
        this.name = name;
        this.snippet = snippet;
        this.imgsrc = imgsrc;
        this.inventory = inventory;
        // 1-count price is input separately, to insure we get one.
        deals.push(new Deal(1, price));
        this.deals = deals;
        // Deals must be sorted by count, for when we calculate the total.
        this.deals.sort(function (left, right) {
            if (left.count < right.count)
                return -1;
            if (left.count > right.count)
                return 1;
            return 0;
        });
    }
    // For setting id.
    Product.id_base = 0;
    return Product;
}());
exports.Product = Product;
// Hardcoded list of products in the store.
var PRODUCTS = [
    new Product("Lamy 2000 (fine nib)", "Precision German pen-gineering.", 150.00, [new Deal(2, 275.00)], "lamy_2000.jpg", 23),
    new Product("Lil Wayne's Guitar", "Has most strings.", 2600.00, [new Deal(5, 12000.00)], "lil_wayne_guitar.jpg", 14),
    new Product("Yacht", "Apparently haunted.", 35000.00, [], "yacht.jpg", 4),
    new Product("500 Tongue Depressors", "Slightly used.", 12.00, [new Deal(5, 55.00), new Deal(20, 200)], "tongue_depressors.jpg", 350),
    new Product("Decoder Ring", "One size fits all.", 0.02, [new Deal(300, 5.99)], "decoder_ring.jpg", 5),
    new Product("Burned Quarter", "Found near the road.", 0.25, [], "burned_quarter.jpg", 12),
    new Product("Wool Hat", "Found near the quarter.", 1.00, [new Deal(10, 9.00), new Deal(100, 84.00)], "wool_hat.jpg", 45)
];
// Tracks information about items customer will purchase.
var Purchase = (function () {
    function Purchase(product) {
        this.quantity = 0;
        this.product = product;
    }
    return Purchase;
}());
exports.Purchase = Purchase;
// Contains a list of purchases and manages the functionality for totaling their prices.
var Basket = (function () {
    function Basket() {
        // List of purchases.
        // All purchases have quantity > 0.
        // Products within purchases are unique.
        this.purchases = [];
        // Total value of all purchases.  Only known after getTotal();
        // Otherwise hidden.
        this.total = 0;
        // Total is hidden unless getTotal() was just called.  All other functions
        // hide the total.
        this.showTotal = false;
    }
    // For internal use.  Gets the index of the purchase containing the input product.
    // Returns -1 if product has not been purchased.
    Basket.prototype.getIndex = function (product) {
        for (var i = 0; i < this.purchases.length; ++i) {
            var purchase = this.purchases[i];
            if (purchase.product.id == product.id) {
                return i;
            }
        }
        return -1;
    };
    // Returns the quanity of the product bought.
    // Returns 0 if product not in list.
    Basket.prototype.getQuantity = function (product) {
        var index = this.getIndex(product);
        if (index != -1) {
            return this.purchases[index].quantity;
        }
        return 0;
    };
    // Buy a copy of the product.  Creates a purchase for the product if none exists,
    // increments the quantity of the purchase.
    Basket.prototype.buy = function (product) {
        // Hide total because this operation invalidates it.
        this.showTotal = false;
        var index = this.getIndex(product);
        if (index == -1) {
            this.purchases.push(new Purchase(product));
            index = this.purchases.length - 1;
        }
        this.purchases[index].quantity += 1;
    };
    // Remove a product from the purchases.  If product hasn't been bought, makes no change.
    // If product has been bought, decrements the quantity of its purchase.  If quantity is
    // now 0, removes the purchase from the list.
    // Returns the number of items unbought (0 or 1).
    Basket.prototype.unbuy = function (product) {
        // Hide total because this operation invalidates it.
        this.showTotal = false;
        var index = this.getIndex(product);
        if (index == -1) {
            return 0;
        }
        this.purchases[index].quantity -= 1;
        if (this.purchases[index].quantity <= 0) {
            this.purchases.splice(index, 1);
        }
        return 1;
    };
    // Calculates the total value of all purchases and stores in this.total, then sets
    // the basket to show the total.
    Basket.prototype.getTotal = function () {
        this.total = 0;
        for (var i = 0; i < this.purchases.length; ++i) {
            // Loop over all purchases.
            var purchase = this.purchases[i];
            var product = purchase.product;
            var purchased = purchase.quantity;
            for (var j = product.deals.length - 1; j >= 0; --j) {
                // Loop through all deals in reverse, i.e. decreasing count, so tht you break
                // the total quantity up into the biggest possible chunks, price those, then 
                // price the remainder according to the lower-count deals.  Because the 0th
                // deal has a count of 1, there will be no remainder after calculating its price.
                // Every deal list contains a deal with a count of 1, so every quantity can be
                // assigned a price.
                var deal = product.deals[j];
                this.total += Math.trunc(purchased / deal.count) * deal.price;
                purchased %= deal.count;
            }
        }
        this.showTotal = true;
    };
    return Basket;
}());
exports.Basket = Basket;
// Stores information about the customer.  Very primative.
var Customer = (function () {
    function Customer(username) {
        this.username = username;
        this.basket = new Basket();
    }
    return Customer;
}());
exports.Customer = Customer;
//# sourceMappingURL=app.component.js.map