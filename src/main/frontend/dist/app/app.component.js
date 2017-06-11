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
        this.customer = new Customer("");
        this.customers = [this.customer];
    }
    AppComponent.prototype.switchTo = function (username) {
        if (!username) {
            return;
        }
        if (!this.customer.username) {
            this.customer.username = username;
            return;
        }
        for (var i = 0; i < this.customers.length; ++i) {
            if (this.customers[i].username === username) {
                this.customer = this.customers[i];
                return;
            }
        }
        this.customer = new Customer(username);
        this.customers.push(this.customer);
    };
    AppComponent.prototype.buy = function (product) {
        if (product.inventory > 0) {
            product.inventory -= 1;
            this.customer.basket.buy(product);
        }
    };
    AppComponent.prototype.unbuy = function (product) {
        if (this.customer.basket.getQuantity(product) > 0) {
            product.inventory += 1;
            this.customer.basket.unbuy(product);
        }
    };
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
var Deal = (function () {
    function Deal(count, price) {
        this.count = count;
        this.price = price;
    }
    return Deal;
}());
exports.Deal = Deal;
var Product = (function () {
    function Product(name, snippet, price, deals, imgsrc, inventory) {
        this.id = Product.id_base++;
        this.name = name;
        this.snippet = snippet;
        this.imgsrc = imgsrc;
        this.inventory = inventory;
        deals.push(new Deal(1, price));
        this.deals = deals;
        // Deals must be sorted by count.
        this.deals.sort(function (left, right) {
            if (left.count < right.count)
                return -1;
            if (left.count > right.count)
                return 1;
            return 0;
        });
    }
    Product.id_base = 0;
    return Product;
}());
exports.Product = Product;
var PRODUCTS = [
    new Product("Lamy 2000 (fine nib)", "Precision German pen-gineering.", 150.00, [new Deal(2, 275.00)], "lamy_2000.jpg", 23),
    new Product("Lil Wayne's Guitar", "Has most strings.", 2600.00, [new Deal(5, 12000.00)], "lil_wayne_guitar.jpg", 14),
    new Product("Yacht", "Apparently haunted.", 35000.00, [], "yacht.jpg", 4),
    new Product("500 Tongue Depressors", "Slightly used.", 12.00, [new Deal(5, 55.00), new Deal(20, 200)], "tongue_depressors.jpg", 350),
    new Product("Decoder Ring", "One size fits all.", 0.02, [new Deal(300, 5.99)], "decoder_ring.jpg", 5),
    new Product("Burned Quarter", "Found near the road.", 0.25, [], "burned_quarter.jpg", 12),
    new Product("Wool Hat", "Found near the quarter.", 1.00, [new Deal(10, 9.00), new Deal(100, 84.00)], "wool_hat.jpg", 45)
];
var Purchase = (function () {
    function Purchase(product) {
        this.quantity = 0;
        this.product = product;
    }
    return Purchase;
}());
exports.Purchase = Purchase;
var Basket = (function () {
    function Basket() {
        this.purchases = [];
        this.total = 0;
        this.showTotal = false;
    }
    Basket.prototype.getIndex = function (product) {
        for (var i = 0; i < this.purchases.length; ++i) {
            var purchase = this.purchases[i];
            if (purchase.product.id == product.id) {
                return i;
            }
        }
        return -1;
    };
    Basket.prototype.getQuantity = function (product) {
        var index = this.getIndex(product);
        if (index != -1) {
            return this.purchases[index].quantity;
        }
        return 0;
    };
    Basket.prototype.buy = function (product) {
        this.showTotal = false;
        var index = this.getIndex(product);
        if (index == -1) {
            this.purchases.push(new Purchase(product));
            index = this.purchases.length - 1;
        }
        this.purchases[index].quantity += 1;
    };
    Basket.prototype.unbuy = function (product) {
        this.showTotal = false;
        var index = this.getIndex(product);
        if (index == -1) {
            return;
        }
        this.purchases[index].quantity -= 1;
        if (this.purchases[index].quantity <= 0) {
            this.purchases.splice(index, 1);
        }
    };
    Basket.prototype.getTotal = function () {
        this.total = 0;
        for (var i = 0; i < this.purchases.length; ++i) {
            var purchase = this.purchases[i];
            var product = purchase.product;
            var purchased = purchase.quantity;
            for (var j = product.deals.length - 1; j >= 0; --j) {
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
var Customer = (function () {
    function Customer(username) {
        this.username = username;
        this.basket = new Basket();
    }
    return Customer;
}());
exports.Customer = Customer;
//# sourceMappingURL=app.component.js.map