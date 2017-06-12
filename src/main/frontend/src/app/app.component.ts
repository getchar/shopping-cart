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
    // The customer whose basket will appear on the screen.
    customer: Customer = new Customer("");
    // All known customers.  Begins lifecycle empty.
    customers: Customer[] = [this.customer];

    // Switch to the customer whose username was entered.
    // If no such customer doesn't exist, create one.
    // AppComponent initialized with anonymous customer; if that is the current
    // customer, assign name to it but leave basket as is.
    switchTo(username: string): void {
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
    }

    // Check to see if the product is in stock, then let the customer buy it.
    buy(product: Product): void {
	if (product.inventory > 0) {
	    product.inventory -= 1;
	    this.customer.basket.buy(product);
	}
    }

    // Let the customer unbuy the product.  If the customer has an item to return,
    // add it back to the inventory.
    unbuy(product: Product): void {
	product.inventory += this.customer.basket.unbuy(product);
    }

    // Print price in the German style.
    prettyPrice(price: number): string {
	return price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR'});
    }
}

// This class stores information about price per number of units.
export class Deal {
    // The number of units that must be bought to trigger the price.
    count: number;
    // The price.
    price: number;
    
    constructor(count: number, price: number) {
	this.count = count;
	this.price = price;
    }
}

// This class stores information about the products in the store.
export class Product {
    // Used to identify products.
    id: number;
    // Product's display name.
    name:string;
    // Description of the product.
    snippet: string;
    // Prices at which the product is available.
    // Must contain deal with count of 1.
    // Must be sorted in ascending order by count.
    // Counts must be unique.
    deals: Deal[];
    // Name of the file containing a picture of the product.
    // Picture must be stored in $PROJECT_HOME/src/main/frontend/src/img
    imgsrc: string;
    // Number of instances of the product available.
    inventory: number;

    // For setting id.
    static id_base: number = 0;

    constructor(name: string, snippet: string, price: number, deals: Deal[], imgsrc: string, inventory: number) {
	this.id = Product.id_base++;
	this.name = name;
	this.snippet = snippet;
	this.imgsrc = imgsrc;
	this.inventory = inventory;
	// 1-count price is input separately, to insure we get one.
	deals.push(new Deal(1, price));
	this.deals = deals;
	// Deals must be sorted by count, for when we calculate the total.
	this.deals.sort((left, right) => {
		if (left.count < right.count) return -1;
		if (left.count > right.count) return 1;
		return 0;
	    });
    }
}

// Hardcoded list of products in the store.
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

// Tracks information about items customer will purchase.
export class Purchase {
    // Quantity of instances of the product to be purchased.
    quantity: number;
    // Which product is bought.
    product: Product;

    constructor(product: Product) {
	this.quantity = 0;
	this.product = product;
    }
}

// Contains a list of purchases and manages the functionality for totaling their prices.
export class Basket {
    // List of purchases.
    // All purchases have quantity > 0.
    // Products within purchases are unique.
    purchases: Purchase[] = [];
    // Total value of all purchases.  Only known after getTotal();
    // Otherwise hidden.
    total: number = 0;
    // Total is hidden unless getTotal() was just called.  All other functions
    // hide the total.
    showTotal: boolean = false;

    // For internal use.  Gets the index of the purchase containing the input product.
    // Returns -1 if product has not been purchased.
    getIndex(product: Product): number {
	for (var i = 0; i < this.purchases.length; ++i) {
	    var purchase = this.purchases[i];
	    if (purchase.product.id == product.id) {
		return i;
	    }
	}
	return -1;
    }
 
    // Returns the quanity of the product bought.
    // Returns 0 if product not in list.
    getQuantity(product: Product): number {
	var index = this.getIndex(product);
	if (index != -1) {
	    return this.purchases[index].quantity;
	}
	return 0;
    }

    // Buy a copy of the product.  Creates a purchase for the product if none exists,
    // increments the quantity of the purchase.
    buy(product: Product) {
	// Hide total because this operation invalidates it.
	this.showTotal = false;
	var index = this.getIndex(product);
	if (index == -1) {
	    this.purchases.push(new Purchase(product));
	    index = this.purchases.length - 1;
	}
	this.purchases[index].quantity += 1;
    }

    // Remove a product from the purchases.  If product hasn't been bought, makes no change.
    // If product has been bought, decrements the quantity of its purchase.  If quantity is
    // now 0, removes the purchase from the list.
    // Returns the number of items unbought (0 or 1).
    unbuy(product: Product): number {
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
    }

    // Calculates the total value of all purchases and stores in this.total, then sets
    // the basket to show the total.
    getTotal(): void {
	this.total = 0;
	for (var i = 0; i < this.purchases.length; ++i) {
	    // Loop over all purchases.
	    var purchase = this.purchases[i];
	    var product: Product = purchase.product;
	    var purchased: number  = purchase.quantity;
	    for (var j = product.deals.length - 1; j >= 0; --j) {
		// Loop through all deals in reverse, i.e. decreasing count, so tht you break
		// the total quantity up into the biggest possible chunks, price those, then 
		// price the remainder according to the lower-count deals.  Because the 0th
		// deal has a count of 1, there will be no remainder after calculating its price.
		// Every deal list contains a deal with a count of 1, so every quantity can be
		// assigned a price.
		var deal: Deal = product.deals[j];
		this.total += Math.trunc(purchased / deal.count) * deal.price;
		purchased %= deal.count;
	    }
	}
	this.showTotal = true;
    }
}

// Stores information about the customer.  Very primative.
export class Customer {
    // Information about the customer's purchases.
    basket: Basket;
    // The customer's username.
    username: string;

    constructor(username: string) {
	this.username = username;
	this.basket = new Basket();
    }
}