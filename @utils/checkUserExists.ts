import { graphqlClient } from '../@utils/graphqlRequestConfig';
import { gql } from 'graphql-request';

export async function checkUserByUsername(username:string):Promise<boolean> {
    return new Promise((resolve,reject) => {
        // fetch dats from database where user is email

        let queryPayload = gql`
            query checkUsername($username: String!) {
                checkIfUsernameExist(username: $username) {
                    username
                }
            }
        `;
        
        let variable = {
            username
        };

        graphqlClient.request(queryPayload, variable)
        .then(resp => {
            // console.log(resp)
            // if(resp.checkIfUsernameExist !== null) {
            //     console.log(`User exist already, `, resp.checkIfUsernameExist.username);
            // }
            resolve((resp.checkIfUsernameExist !== null ) ? true : false);
        })
        .catch(e => {
            console.log(`An error occured while verifying username`);
            reject(e);
        })
    });
};