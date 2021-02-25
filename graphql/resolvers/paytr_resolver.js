const { typeDefs } = require("../typedefs/paytr_schema");
const { createUser, activateUser } = require("../../DRY_CODES/auths_dry");

const resolvers = {
    Query: {
        checkEmail: async (_, { email }, ctx) => {
            // 
        },
        checkUsername: async (_, { paytr_username }, ctx) => {
            // 
        }
    },

    Mutation: {
        createPaytrAccount: async (_, { input }, ctx) => {
            const user = await createUser(input);
            console.log(ctx)
            return user;
        },

        activatePaytrAccount: async (_, { token }, ctx) => {
            // activate user
            const activated = await activateUser(token);
            return activated;
        },

        login: async (_, args, ctx) => {
            //  Log user in
        },

        initializeTransaction: async (_, args, ctx) => {
            // Initialize transaction
        },
    }
}

module.exports = {
    resolvers
}