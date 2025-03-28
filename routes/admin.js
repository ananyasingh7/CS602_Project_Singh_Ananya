import express from 'express';
import { Admin, Product, Customer } from '../models/index.js';
import { addProduct, deleteProduct, getAllCustomers, deleteOrder } from '../module.js';

const router = express.Router();

const requireAdmin = (req, res, next) => {
    if (!req.session.isAdmin) {
        return res.redirect('/auth/login');
    }
    next();
};

router.use(requireAdmin);

router.get('/dashboard', async (req, res) => {
    try {
        const products = await Product.find().lean();
        const customers = await Customer.find().lean();
        res.render('admin-dashboard', {
            adminName: req.session.adminName || 'Admin',
            products,
            customers,
            message: req.query.message
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.render('admin-dashboard', {
            adminName: req.session.adminName || 'Admin',
            error: 'Failed to load data'
        });
    }
});

router.post('/products/add', async (req, res) => {
    try {
        const { name, description, price, quantity_in_stock } = req.body;
        const productData = {
            name,
            description,
            price: parseFloat(price),
            quantity_in_stock: parseInt(quantity_in_stock)
        };
        
        await addProduct(productData);
        res.redirect('/admin/dashboard?message=Product added successfully');
    } catch (error) {
        console.error('Error adding product:', error);
        res.redirect('/admin/dashboard?message=Failed to add product');
    }
});

router.get('/products/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await deleteProduct(id);
        res.redirect('/admin/dashboard?message=Product deleted successfully');
    } catch (error) {
        console.error('Error deleting product:', error);
        res.redirect('/admin/dashboard?message=Failed to delete product');
    }
});

router.get('/customers/orders/:id', async (req, res) => {
    try {
        const customerId = req.params.id;
        const products = await Product.find().lean();
        const customers = await Customer.find().lean();

        const selectedCustomer = await Customer.findOne({ _id: customerId }).lean();
        
        if (!selectedCustomer) {
            return res.redirect('/admin/dashboard?message=Customer not found');
        }
        
        res.render('admin-dashboard', {
            adminName: req.session.adminName || 'Admin',
            products,
            customers,
            selectedCustomer
        });
    } catch (error) {
        console.error('Error fetching customer orders:', error);
        res.redirect('/admin/dashboard?message=Failed to fetch customer orders');
    }
});

router.get('/orders/delete/:customerId/:orderId', async (req, res) => {
    try {
        const { customerId, orderId } = req.params;
        await deleteOrder(orderId);
        res.redirect(`/admin/customers/orders/${customerId}?message=Order deleted successfully`);
    } catch (error) {
        console.error('Error deleting order:', error);
        res.redirect(`/admin/customers/orders/${req.params.customerId}?message=Failed to delete order`);
    }
});

export { router };