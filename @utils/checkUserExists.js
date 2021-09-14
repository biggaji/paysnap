"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserByUsername = void 0;
const graphqlRequestConfig_1 = require("../@utils/graphqlRequestConfig");
const graphql_request_1 = require("graphql-request");
function checkUserByUsername(username) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            // fetch dats from database where user is email
            let queryPayload = graphql_request_1.gql `
            query checkUsername($username: String!) {
                checkIfUsernameExist(username: $username) {
                    username
                }
            }
        `;
            let variable = {
                username
            };
            graphqlRequestConfig_1.graphqlClient.request(queryPayload, variable)
                .then(resp => {
                // console.log(resp)
                // if(resp.checkIfUsernameExist !== null) {
                //     console.log(`User exist already, `, resp.checkIfUsernameExist.username);
                // }
                resolve((resp.checkIfUsernameExist !== null) ? true : false);
            })
                .catch(e => {
                console.log(`An error occured while verifying username`);
                reject(e);
            });
        });
    });
}
exports.checkUserByUsername = checkUserByUsername;
;
