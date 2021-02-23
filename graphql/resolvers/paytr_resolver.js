const { typeDefs } = require("../typedefs/paytr_schema");
const { createUser } = require("../../DRY_CODES/auths_dry");

const resolvers = {
    Query: {
        Paytr_user: (_, { paytr_id }) => {

        },
        me: () => "My name is Tobi Ajibade. I am a software engineer and ceo of Paytr",
    },

    Mutation: {
        createPaytrAccount: async (_, args, ctx) => {
            const user = await createUser(args);
            return user;
        },
        login: async (_, args, ctx) => {
            // 
        },
        initializeTransaction: async (_, args, ctx) => {
            // Initialize transaction
        }
    }
}

module.exports = {
    resolvers
}