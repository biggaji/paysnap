import { graphqlClient } from '../@utils/graphqlRequestConfig';
import { gql } from 'graphql-request';

export async function checkUserByUsername(username:string):Promise<boolean> {
    return new Promise((resolve,reject) => {
        // fetch data from database to check username validity

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
            resolve((resp.checkIfUsernameExist !== null ) ? true : false);
        })
        .catch(e => {
            console.log(`An error occured while verifying username`);
            reject(e);
        })
    });
};

export async function checkUserByEmail(email:string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // fetch data from database to check email validity

      let queryPayload = gql`
        query checkEmail($email: String!) {
          checkIfEmailExist(email: $email) {
            email
          }
        }
      `;

      let variable = {
        email
      };

      graphqlClient
        .request(queryPayload, variable)
        .then((resp) => {
          resolve(resp.checkIfEmailExist !== null ? true : false);
        })
        .catch((e) => {
          console.log(`An error occured while verifying email`, e);
          reject(e);
        });
    });
};