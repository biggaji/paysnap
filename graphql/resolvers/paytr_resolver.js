const { typeDefs } = require("../typedefs/paytr_schema");
const { createUser, activateUser } = require("../../DRY_CODES/auths_dry");

const resolvers = {
    Query: {
        Paytr_user: (_, { paytr_id }) => {

        },
        me: () => "My name is Tobi Ajibade. I am a software engineer and ceo of Paytr",
    },

    Mutation: {
        createPaytrAccount: async (_, { input }, ctx) => {
            const user = await createUser(input);
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