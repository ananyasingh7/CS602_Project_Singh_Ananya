import express from 'express';
import { placeOrder } from '../module.js';
import { Customer, Admin, Order, Product } from '../models/index.js';

const router = express.Router();

router.post('/place', async (req, res) => {
    try {
        console.log("Request body:", req.body);
        let { customerId, productIds, quantities } = req.body;

        if (!productIds) {
            return res.status(400).send("Please select at least one product");
        }

        if (!customerId) {
            return res.status(400).send("Customer ID is required");
        }
        if (!Array.isArray(productIds)) {
            productIds = [productIds];
        }

        if (!Array.isArray(quantities)) {
            quantities = [quantities];
        }

        console.log("Processed arrays - productIds:", productIds);
        console.log("Processed arrays - quantities:", quantities);

        const productOrders = productIds.map((id, index) => {
            const quantity = Number(quantities[index] || 1);
            return {
                productId: id,
                quantity: quantity
            };
        });

        console.log("Processed product orders:", productOrders);

        const result = await placeOrder(customerId, productOrders);

        if (result.error) {
            if (req.get('Content-Type') === 'application/json') {
                return res.status(400).json({ error: result.error });
            }
            return res.status(400).send(result.error);
        }

        if (req.get('Content-Type') === 'application/json') {
            return res.status(201).json({
                success: true,
                message: "Order placed successfully",
                order: result
            });
        }

        res.redirect('/products?success=true');

    } catch (error) {
        console.error("Error placing order:", error);

        if (req.get('Content-Type') === 'application/json') {
            return res.status(500).json({
                error: "Error placing order",
                details: error.message
            });
        }

        res.status(500).send(`Error placing order: ${error.message}`);
    }
});

router.get('/history', async (req, res) => {
    try {
        const customerId = req.session?.customerId || "1";
        if (!customerId) {
            return res.status(400).send("Customer not logged in");
        }

        console.log("Looking for customer with ID:", customerId);

        const customer = await Customer.findOne({ _id: customerId }).lean();

        if (!customer) {
            return res.status(404).send("Customer not found");
        }

        console.log("Found customer:", customer.name);
        console.log("Order count:", customer.orders ? customer.orders.length : 0);

        if (customer.orders && customer.orders.length > 0) {
            console.log("First order ID:", customer.orders[0]._id);
            console.log("First order total price:", customer.orders[0].total_price);
            console.log("First order status:", customer.orders[0].status);
            console.log("First order date:", customer.orders[0].createdAt);

            if (customer.orders[0].products && customer.orders[0].products.length > 0) {
                console.log("First product in first order:", customer.orders[0].products[0]);
            } else {
                console.log("No products in first order or products array undefined");
            }
        }

        res.render('order-history', {
            orders: customer.orders || [],
            customerName: customer.name
        });

    } catch (error) {
        console.error("Error fetching order history:", error);
        res.status(500).send(`Error fetching order history: ${error.message}`);
    }
});

export { router };