import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import { router as productRoutes } from './routes/products.js';
import { router as graphQLRoutes } from './routes/graphql.js';
import { router as authRoutes } from './routes/auth.js';
import { router as orderRoutes } from './routes/orders.js';
import { router as adminRoutes } from './routes/admin.js';

const app = express();

const MONGO_URI = "mongodb://127.0.0.1:27017/cs602_project";

const connectDB = async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB Connected!");
    } else {
        console.log("MongoDB Already Connected!");
    }
    return mongoose.connection;
};

const connection = await connectDB();

export { connection };

app.engine(
    'handlebars',
    engine({
        extname: '.handlebars',
        defaultLayout: 'main',
        layoutsDir: './views/layouts',
        helpers: {
            json: (context) => JSON.stringify(context, null, 2),
        }
    })
);
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.static('./public'));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.isAdmin = req.session.isAdmin || false;
    res.locals.isLoginPage = false;
    res.locals.adminName = req.session.adminName || null;
    res.locals.customerName = req.session.customerName || null;
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/graphql', graphQLRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => {
    res.status(404);
    res.render('404');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
});