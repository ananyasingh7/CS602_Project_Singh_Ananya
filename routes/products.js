import express from 'express';
import { Customer, Admin, Order, Product } from '../models/index.js';

const router = express.Router();

router.use((req, res, next) => {
    if (req.method !== 'GET' && req.headers['content-type'] !== 'application/json') {
        return res.status(400).json({ error: "Request body must be JSON" });
    }
    next();
});

router.get('/', async (req, res) => {
    try {
        const products = await Product.find().lean();
        console.log("Fetched Products:", products);
        
        const success = req.query.success === 'true';
        
        if (req.get('Accept') === 'application/json') {
            return res.json(products);
        }
        
        res.render('products', { 
            products,
            success,
            successMessage: "Order placed successfully!"
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Error fetching products");
    }
});

router.get('/search', async (req, res) => {
    try {
        let { query, name, minPrice, maxPrice } = req.query;
        let filter = {};

        if (!query && name) {
            query = name;
        }

        if (query) {
            filter.$or = [
                { name: new RegExp(query, "i") },
                { description: new RegExp(query, "i") }
            ];
        }
        if (minPrice && maxPrice) {
            filter.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };
        }

        const products = await Product.find(filter).lean();

        if (req.get('Accept') === 'application/json') {
            return res.json(products);
        }

        res.render('products', { products, query, minPrice, maxPrice });

    } catch (error) {
        console.error("Error searching products:", error);
        res.status(500).json({ error: "Error searching products" });
    }
});

router.post('/', async (req, res) => {
    const newProduct = new Product({ _id: Date.now().toString(), ...req.body });
    await newProduct.save();
    res.json(newProduct);
});

router.put('/:id', async (req, res) => {
    const updatedProduct = await Product.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
    );
    res.json(updatedProduct);
});

router.delete('/:id', async (req, res) => {
    const deletedProduct = await Product.findOneAndDelete({ _id: req.params.id });
    res.json(deletedProduct);
});

export { router };