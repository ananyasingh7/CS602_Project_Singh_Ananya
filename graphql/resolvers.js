import { Product } from '../models/Product.js';

export const resolvers = {
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
      await Product.findOneAndUpdate({ _id: parseInt(id) }, { name, description, price, quantity_in_stock }, { new: true }),
    deleteProduct: async (_, { id }) => await Product.findOneAndDelete({ _id: parseInt(id) }),
  }
};