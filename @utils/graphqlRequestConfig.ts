import { GraphQLClient } from 'graphql-request';

const API_ENDPOINT = "https://api-paysnap.herokuapp.com/graphql";

export const graphqlClient = new GraphQLClient(API_ENDPOINT, {
    headers: {
        'Content-type' : 'application/json'
    }
});