import express from 'express';
import { Customer, Admin } from '../models/index.js';

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login', {
        error: req.session?.error,
        isLoginPage: true
    });
    if (req.session) req.session.error = null;
});

router.post('/login', async (req, res) => {
    const { email, password, isAdmin } = req.body;

    try {
        if (isAdmin === 'on') {
            const admin = await Admin.findOne({ _id: "1" }).lean();

            if (!admin) {
                return res.render('login', {
                    error: "Admin account not found!",
                    isLoginPage: true
                });
            }
            req.session.adminId = admin._id;
            req.session.adminName = admin.name;
            req.session.isAdmin = true;

            return res.redirect('/admin/dashboard');
        } else {
            const customer = await Customer.findOne({ email });

            if (!customer || customer.password !== password) {
                return res.render('login', {
                    error: "Invalid email or password!",
                    isLoginPage: true
                });
            }

            req.session.customerId = customer._id;
            req.session.customerName = customer.name;
            req.session.isAdmin = false;

            return res.redirect('/products');
        }
    } catch (error) {
        console.error(error);
        res.render('login', {
            error: "Something went wrong!",
            isLoginPage: true
        });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/auth/login');
    });
});

export { router };