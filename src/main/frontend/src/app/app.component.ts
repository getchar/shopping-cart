import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dl-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})

export class AppComponent {
    title: string = "Crazy Charlie's House of Deals";
    products: Product[] = PRODUCTS;
    customer: Customer = new Customer("");
    customers: Customer[] = [this.customer];

    switchTo(username: string): void {
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
    }

    buy(product: Product): void {
	if (product.inventory > 0) {
	    product.inventory -= 1;
	    this.customer.basket.buy(product);
	}
    }

    unbuy(product: Product): void {
	if (this.customer.basket.getQuantity(product) > 0) {
	    product.inventory += 1;
	    this.customer.basket.unbuy(product);
	}
    }

    prettyPrice(price: number): string {
	return price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR'});
    }
}

export class Deal {
    count: number;
    price: number;
    
    constructor(count: number, price: number) {
	this.count = count;
	this.price = price;
    }
}

export class Product {
    id: number;
    name:string;
    snippet: string;
    deals: Deal[];
    imgsrc: string;
    inventory: number;

    static id_base: number = 0;

    constructor(name: string, snippet: string, price: number, deals: Deal[], imgsrc: string, inventory: number) {
	this.id = Product.id_base++;
	this.name = name;
	this.snippet = snippet;
	this.imgsrc = imgsrc;
	this.inventory = inventory;
	deals.push(new Deal(1, price));
	this.deals = deals;
	// Deals must be sorted by count.
	this.deals.sort((left, right) => {
		if (left.count < right.count) return -1;
		if (left.count > right.count) return 1;
		return 0;
	    });
    }
}

const PRODUCTS: Product[] =
    [
     new Product("Lamy 2000 (fine nib)", "Precision German pen-gineering.", 150.00, [new Deal(2, 275.00)], "lamy_2000.jpg", 23),
     new Product("Lil Wayne's Guitar", "Has most strings.", 2600.00, [new Deal(5, 12000.00)], "lil_wayne_guitar.jpg", 14),
     new Product("Yacht", "Apparently haunted.", 35000.00, [], "yacht.jpg", 4),
     new Product("500 Tongue Depressors", "Slightly used.", 12.00, [new Deal(5, 55.00), new Deal(20, 200)], "tongue_depressors.jpg", 350),
     new Product("Decoder Ring", "One size fits all.", 0.02, [new Deal(300, 5.99)], "decoder_ring.jpg", 5),
     new Product("Burned Quarter", "Found near the road.", 0.25, [], "burned_quarter.jpg", 12),
     new Product("Wool Hat", "Found near the quarter.", 1.00, [new Deal(10, 9.00), new Deal(100, 84.00)], "wool_hat.jpg", 45)
     ];

export class Purchase {
    quantity: number;
    product: Product;

    constructor(product: Product) {
	this.quantity = 0;
	this.product = product;
    }
}

export class Basket {
    purchases: Purchase[] = [];
    total: number = 0;
    showTotal: boolean = false;

    getIndex(product: Product): number {
	for (var i = 0; i < this.purchases.length; ++i) {
	    var purchase = this.purchases[i];
	    if (purchase.product.id == product.id) {
		return i;
	    }
	}
	return -1;
    }
 
    getQuantity(product: Product): number {
	var index = this.getIndex(product);
	if (index != -1) {
	    return this.purchases[index].quantity;
	}
	return 0;
    }

    buy(product: Product) {
	this.showTotal = false;
	var index = this.getIndex(product);
	if (index == -1) {
	    this.purchases.push(new Purchase(product));
	    index = this.purchases.length - 1;
	}
	this.purchases[index].quantity += 1;
    }

    unbuy(product: Product) {
	this.showTotal = false;
	var index = this.getIndex(product);
	if (index == -1) {
	    return;
	}
	this.purchases[index].quantity -= 1;
	if (this.purchases[index].quantity <= 0) {
	    this.purchases.splice(index, 1);
	}
    }

    getTotal(): void {
	this.total = 0;
	for (var i = 0; i < this.purchases.length; ++i) {
	    var purchase = this.purchases[i];
	    var product: Product = purchase.product;
	    var purchased: number  = purchase.quantity;
	    for (var j = product.deals.length - 1; j >= 0; --j) {
		var deal: Deal = product.deals[j];
		this.total += Math.trunc(purchased / deal.count) * deal.price;
		purchased %= deal.count;
	    }
	}
	this.showTotal = true;
    }
}

export class Customer {
    basket: Basket;
    username: string;

    constructor(username: string) {
	this.username = username;
	this.basket = new Basket();
    }
}