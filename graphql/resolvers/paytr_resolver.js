const { createUser, activateUser, getDashboardData, login, checkUsername, checkEmail } = require("../../DRY_CODES/auths_dry");

const resolvers = {
    Query: {
        getDashboardData: async (_, args, { me }) => {
            console.log(Hello);
            // return await getDashboardData(me);
        },
        checkEmail: async (_, { email }, ctx) => {
            return await checkEmail(email);
        },
        checkUsername: async (_, { paytr_username }, ctx) => {
            return await checkUsername(paytr_username);
        }
    },

    Mutation: {
        createPaytrAccount: async (_, { input }, ctx) => {
            return await createUser(input);
        },

        activatePaytrAccount: async (_, { token }, ctx) => {
            // activate user
            return await activateUser(token);
        },

        login: async (_, args, ctx) => {
            //  Log user in
            return await login(args);
        },

        initializeTransaction: async (_, args, ctx) => {
            // Initialize transaction
        },
    }
}

module.exports = {
    resolvers
}