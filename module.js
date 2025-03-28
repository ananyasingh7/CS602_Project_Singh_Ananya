import mongoose from 'mongoose';
import { dbURL } from "./db/credentials.js";

import { Customer, Admin, Order, Product } from './models/index.js';

import { connection } from './server.js';

export const getAllProducts = async () => {
    return await Product.find();
};

export const searchProducts = async (query) => {
    return await Product.find({
        $or: [
            { name: new RegExp(query, "i") },
            { description: new RegExp(query, "i") }
        ]
    });
};

export const placeOrder = async (customerId, products) => {
    try {
        console.log("Received customerId:", customerId, "Type:", typeof customerId);
        console.log("Received products:", JSON.stringify(products));

        const stringCustomerId = String(customerId).trim();
        console.log("Looking for customer with ID:", stringCustomerId);

        const customer = await Customer.findOne({ _id: stringCustomerId });
        console.log("Customer found:", customer ? "Yes" : "No");
        
        if (!customer) {
            return { error: "Customer not found" };
        }

        let totalPrice = 0;
        const orderedProducts = [];

        for (let item of products) {
            const stringProductId = String(item.productId).trim();
            console.log("Looking for product with ID:", stringProductId);
            
            const product = await Product.findOne({ _id: stringProductId });
            console.log("Product found:", product ? product.name : "No");

            if (!product) {
                return { error: `Product with ID ${item.productId} not found` };
            }
            
            const quantity = Number(item.quantity);
            
            if (product.quantity_in_stock < quantity) {
                return { error: `Not enough stock for ${product.name}` };
            }

            product.quantity_in_stock -= quantity;
            await product.save();

            totalPrice += product.price * quantity;
            
            orderedProducts.push({
                _id: product._id,
                name: product.name,
                description: product.description || "",
                price: product.price,
                quantity: quantity
            });
        }

        const orderId = String(Date.now());
        
        const orderData = {
            _id: orderId,
            customer: {
                _id: customer._id,
                name: customer.name,
                email: customer.email
            },
            products: orderedProducts,
            total_price: totalPrice,
            status: "Pending",
            createdAt: new Date()
        };

        const newOrder = new Order(orderData);
        await newOrder.save();
        console.log("New order created:", orderId);

        const customerOrderData = {
            _id: orderId,
            products: orderedProducts,
            total_price: totalPrice,
            status: "Pending",
            createdAt: new Date()
        };
        
        const updatedCustomer = await Customer.findOneAndUpdate(
            { _id: stringCustomerId },
            { $push: { orders: customerOrderData } },
            { new: true, runValidators: false }
        );
        
        if (!updatedCustomer) {
            console.warn("Warning: Customer was not updated with new order");
        } else {
            console.log("Order added to customer history using findOneAndUpdate");
        }

        return newOrder;
    } catch (error) {
        console.error("Error placing order:", error);
        return { error: `Error placing order: ${error.message}` };
    }
};

export const addProduct = async (productData) => {
    let newProduct = new Product({
        _id: Date.now(),
        ...productData
    });
    await newProduct.save();
    return newProduct;
};

export const updateProduct = async (productId, updateData) => {
    return await Product.findOneAndUpdate(
        { _id: parseInt(productId) },
        updateData,
        { new: true }
    );
};

export const deleteProduct = async (productId) => {
    return await Product.findOneAndDelete({ _id: parseInt(productId) });
};

export const getAllCustomers = async () => {
    return await Customer.find();
};

export const getCustomerOrders = async (customerId) => {
    let customer = await Customer.findOne({ _id: parseInt(customerId) });
    return customer ? customer.orders : [];
};

export const updateOrder = async (orderId, updateData) => {
    return await Order.findOneAndUpdate(
        { _id: parseInt(orderId) },
        updateData,
        { new: true }
    );
};

export const deleteOrder = async (orderId) => {
    let order = await Order.findOneAndDelete({ _id: parseInt(orderId) });
    if (order) {
        await Customer.updateOne(
            { _id: order.customer._id },
            { $pull: { orders: { _id: parseInt(orderId) } } }
        );
    }
    return order;
};