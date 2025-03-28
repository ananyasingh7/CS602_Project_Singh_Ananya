import { ApolloClient, InMemoryCache, gql } from "@apollo/client/core/core.cjs";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
  defaultOptions: { query: { fetchPolicy: "network-only" } }
});

export const getAllProducts = async () => client.query({ query: gql`query { allProducts { _id name price } }` });

export const searchProducts = async (name) => client.query({
  query: gql`query($name: String!) { searchProducts(name: $name) { _id name } }`,
  variables: { name }
});

export const productsByPriceRange = async (minPrice, maxPrice) => client.query({
  query: gql`query($minPrice: Float!, $maxPrice: Float!) { productsByPriceRange(minPrice: $minPrice, maxPrice: $maxPrice) { _id name price } }`,
  variables: { minPrice, maxPrice }
});

export const addProduct = async (data) => client.mutate({
  mutation: gql`mutation($name: String!, $description: String!, $price: Float!, $quantity_in_stock: Int!) { 
    addProduct(name: $name, description: $description, price: $price, quantity_in_stock: $quantity_in_stock) { _id name }
  }`,
  variables: data
});