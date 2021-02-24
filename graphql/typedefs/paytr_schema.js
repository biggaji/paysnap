const { gql } = require("apollo-server-express");

const typeDefs = gql`
    "Schemas for paytr activities"

    type Paytr_user {
        paytr_id:ID!
        firstname:String!
        lastname:String!
        email:String!
        paytr_username:String!
        paytr_balance:String!
        verified:Boolean
        created_at:String!
        avatar:String
        transactions: [Paytr_transaction]
    }


    type Paytr_transaction {
        paytr_transaction_id:ID!
        paytr_sender_username:String!
        paytr_receiver_username:String!
        paytr_transaction_status:String!
        paytr_amount_sent:String!
        paytr_transacted_at:String!
    }

    type Query {
        "Get a single paytr user"
        Paytr_user(paytr_id:String!):Paytr_user

        "Get the software engineer bio"
        me:String!
    }

    # Input types 

    "Input for creating a paytr account"
    input CreatePaytrAccountInputs {
        firstname:String!
        lastname:String!
        email:String!
        paytr_username:String!
        password:String!
    }
    
    "Interface for mutation error response"
    interface MutationErrorResponse {
        code: Int
        errorMessage:String
    }

    type Mutation {
        "Create a paytr account"
        createPaytrAccount(input:CreatePaytrAccountInputs): Paytr_user

        "Login into a paytr account"
        login(email:String!,password:String!): Paytr_user

        "Initialize a transaction on paytr"
        initializeTransaction(paytr_sender_username:String!,paytr_receiver_username:String!,paytr_amount_sent:String!): Paytr_transaction
    }
`;

module.exports = {
    typeDefs
}