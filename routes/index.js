import express from 'express';
import session from 'express-session';
import { router as productRoutes } from '../routes/products.js';
import { router as graphQLRoutes } from '../routes/graphql.js';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

router.use(express.static('./public'));

router.use('/products', productRoutes);
router.use('/graphql', graphQLRoutes);

router.use((req, res) => {
    res.status(404);
    res.render('404');
});

export { router };
