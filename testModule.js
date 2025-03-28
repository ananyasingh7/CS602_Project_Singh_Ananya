import * as dbModule from './module.js';

let result;

console.log("=== Product Tests ===");

result = await dbModule.getAllProducts();
console.log("All Products:", JSON.stringify(result, null, 2));

result = await dbModule.searchProducts("Laptop");
console.log("Search Products:", JSON.stringify(result, null, 2));

console.log("\n=== Order Tests ===");

result = await dbModule.placeOrder("1", [
    { productId: "2", quantity: 1 },
    { productId: "3", quantity: 2 }
]);
console.log("Place Order:", JSON.stringify(result, null, 2));

const orderId = result._id || "1001";

result = await dbModule.getCustomerOrders("1");
console.log("Customer Orders:", JSON.stringify(result, null, 2));

result = await dbModule.updateOrder(orderId, { status: "Shipped" });
console.log("Updated Order:", JSON.stringify(result, null, 2));

result = await dbModule.deleteOrder(orderId);
console.log("Deleted Order:", JSON.stringify(result, null, 2));

console.log("\n=== Admin Tests ===");

result = await dbModule.getAllCustomers();
console.log("All Customers:", JSON.stringify(result, null, 2));

result = await dbModule.addProduct({
    name: "Test Product",
    description: "Test Description",
    price: 49.99,
    quantity_in_stock: 20
});
console.log("Added Product:", JSON.stringify(result, null, 2));

const productId = result._id;

result = await dbModule.updateProduct(productId, { price: 39.99 });
console.log("Updated Product:", JSON.stringify(result, null, 2));

result = await dbModule.deleteProduct(productId);
console.log("Deleted Product:", JSON.stringify(result, null, 2));

console.log("\n=== Test Complete ===");