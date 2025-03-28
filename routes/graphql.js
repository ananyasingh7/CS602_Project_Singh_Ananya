import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from '../graphql/schema.js';
import { resolvers } from '../graphql/resolvers.js';

const router = express.Router();

const graphQLServer = new ApolloServer({ 
    typeDefs, 
    resolvers,
    csrfPrevention: false
});
await graphQLServer.start();

router.use('/', expressMiddleware(graphQLServer));

export { router };