"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphqlClient = void 0;
const graphql_request_1 = require("graphql-request");
const API_ENDPOINT = "https://api-paysnap.herokuapp.com/graphql";
exports.graphqlClient = new graphql_request_1.GraphQLClient(API_ENDPOINT, {
    headers: {
        'Content-type': 'application/json'
    }
});
