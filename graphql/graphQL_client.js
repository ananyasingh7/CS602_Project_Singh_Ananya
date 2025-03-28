import * as clientModule from './clientShoppingModule.js';

console.log("\nFetching all products...");
console.log(JSON.stringify(await clientModule.getAllProducts(), null, 2));

console.log("\nSearching for products...");
console.log(JSON.stringify(await clientModule.searchProducts("Laptop"), null, 2));

console.log("\nSearching for products by price range...");
console.log(JSON.stringify(await clientModule.productsByPriceRange(20, 100), null, 2));

console.log("\nAdding a new product...");
console.log(JSON.stringify(await clientModule.addProduct({
  name: "Wireless Mouse",
  description: "Bluetooth ergonomic mouse",
  price: 29.99,
  quantity_in_stock: 50
}), null, 2));