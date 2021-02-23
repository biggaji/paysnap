const { typeDefs } = require("../typedefs/paytr_schema");
const { createUser } = require("../../DRY_CODES/auths_dry");

const resolvers = {
    Query: {
        Paytr_user: (_, { paytr_id }) => {

        },

    },

    Mutation: {
        createPaytrAccount: async (_, args, ctx) => {
            const user = await createUser(args);
            return user;
        }
    }
}

module.exports = {
    resolvers
}