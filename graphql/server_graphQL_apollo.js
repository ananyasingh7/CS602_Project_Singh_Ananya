import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';
import { Customer, Admin, Order, Product } from '../models/index.js';

const MONGO_URI = "mongodb://127.0.0.1:27017/cs602_project"; 

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB Connected!");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
};
await connectDB();

const typeDefs = `#graphql
  type Product {
    _id: ID!
    name: String!
    description: String!
    price: Float!
    quantity_in_stock: Int!
  }

  type Query {
    allProducts: [Product]
    searchProducts(name: String!): [Product]
    productsByPriceRange(minPrice: Float!, maxPrice: Float!): [Product]
  }

  type Mutation {
    addProduct(name: String!, description: String!, price: Float!, quantity_in_stock: Int!): Product
    updateProduct(id: ID!, name: String, description: String, price: Float, quantity_in_stock: Int): Product
    deleteProduct(id: ID!): Product
  }
`;

const resolvers = {
  Query: {
    allProducts: async () => await Product.find(),
    searchProducts: async (_, { name }) => await Product.find({ name: new RegExp(name, "i") }),
    productsByPriceRange: async (_, { minPrice, maxPrice }) =>
      await Product.find({ price: { $gte: minPrice, $lte: maxPrice } }),
  },

  Mutation: {
    addProduct: async (_, { name, description, price, quantity_in_stock }) => {
      const newProduct = new Product({ _id: Date.now(), name, description, price, quantity_in_stock });
      await newProduct.save();
      return newProduct;
    },
    updateProduct: async (_, { id, name, description, price, quantity_in_stock }) =>
      await Product.findOneAndUpdate(
        { _id: parseInt(id) },
        { name, description, price, quantity_in_stock },
        { new: true }
      ),
    deleteProduct: async (_, { id }) => await Product.findOneAndDelete({ _id: parseInt(id) }),
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

console.log(`🚀 GraphQL Server ready at: ${url}`);