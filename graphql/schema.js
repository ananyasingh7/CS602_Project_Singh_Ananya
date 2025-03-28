import { gql } from 'graphql-tag';

export const typeDefs = gql`
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