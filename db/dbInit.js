import fs from 'fs';
import { MongoClient, ServerApiVersion } from "mongodb";
import { dbURL } from "./credentials.js";

const client = new MongoClient(dbURL, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

function convertIdsToStrings(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(item => convertIdsToStrings(item));
    }
    const result = {};
    for (const key in obj) {
        if (key === '_id') {
            result[key] = String(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            result[key] = convertIdsToStrings(obj[key]);
        } else {
            result[key] = obj[key];
        }
    }
    return result;
}

async function importData() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("cs602_project");

        let productsData = JSON.parse(fs.readFileSync('products.json', 'utf8')).products;
        console.log("Read", productsData.length, "products");

        productsData = convertIdsToStrings(productsData);

        const productsCollection = db.collection("products");
        await productsCollection.deleteMany({});
        await productsCollection.insertMany(productsData);
        console.log("Inserted Products");

        let customersData = JSON.parse(fs.readFileSync('customers.json', 'utf8')).customers;
        console.log("Read", customersData.length, "customers");

        customersData = convertIdsToStrings(customersData);

        const customersCollection = db.collection("customers");
        await customersCollection.deleteMany({});
        await customersCollection.insertMany(customersData);
        console.log("Inserted Customers");

        let ordersData = JSON.parse(fs.readFileSync('orders.json', 'utf8')).orders;
        console.log("Read", ordersData.length, "orders");

        ordersData = convertIdsToStrings(ordersData);

        const ordersCollection = db.collection("orders");
        await ordersCollection.deleteMany({});
        await ordersCollection.insertMany(ordersData);
        console.log("Inserted Orders");

        for (const order of ordersData) {
            await customersCollection.updateOne(
                { _id: order.customer._id },
                { $push: { orders: order } }
            );
        }
        console.log("Embedded Full Orders into Customers");

        let adminsData = JSON.parse(fs.readFileSync('admins.json', 'utf8')).admins;
        console.log("Read", adminsData.length, "admins");

        adminsData = convertIdsToStrings(adminsData);

        const adminsCollection = db.collection("admins");
        await adminsCollection.deleteMany({});
        await adminsCollection.insertMany(adminsData);
        console.log("Inserted Admins");

    } catch (error) {
        console.error("Error importing data:", error);
    } finally {
        await client.close();
        console.log("MongoDB connection closed");
    }
}

importData();