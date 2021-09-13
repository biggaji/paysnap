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
exports.ActivateAccountPostController = exports.LoginPostController = exports.CreateAccountPostController = exports.RedenderDashboardController = exports.resetPasswordController = exports.activateAccountController = exports.signInController = exports.signUpController = void 0;
const graphqlRequestConfig_1 = require("../../@utils/graphqlRequestConfig");
const graphql_request_1 = require("graphql-request");
const asteriskEmail_1 = require("../../@utils/asteriskEmail");
const signUpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("signup", { pageTitle: "Sign up" });
});
exports.signUpController = signUpController;
const signInController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("login", { pageTitle: "Sign in" });
});
exports.signInController = signInController;
const activateAccountController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let email = req.headers.authorization || req.cookies.email;
    // console.log(email)
    email = yield asteriskEmail_1.asteriskMail(email);
    res.render("activate", { pageTitle: "Activate account", email });
});
exports.activateAccountController = activateAccountController;
const resetPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("requestPasswordRequest", { pageTitle: "Request password reset" });
});
exports.resetPasswordController = resetPasswordController;
const RedenderDashboardController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("dashboard", { pageTitle: "", dashboard: "" });
});
exports.RedenderDashboardController = RedenderDashboardController;
const CreateAccountPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, username, country, password, fullname } = req.body;
    // mutation for create user
    const createAccountMutation = graphql_request_1.gql `
    mutation createAccount($Opts: CreateAccountInputs!) {
        createAccount(opts:$Opts) {
        code
        success
        message
        user {
          id
          email
        }
        token
      }
    }
  `;
    // const query = gql`
    //   query CheckUsername($username: String!) {
    //     checkIfUsernameExist(username:$username) {
    //       username
    //     }
    //   }
    // `;
    const variables = {
        Opts: {
            fullname,
            email,
            username,
            country,
            password
        }
    };
    graphqlRequestConfig_1.graphqlClient.request(createAccountMutation, variables)
        .then(result => {
        console.log(`Payload data: `, result.createAccount.message);
        const { user, token } = result.createAccount;
        res.cookie("email", user.email, { httpOnly: true });
        res.cookie("x_user_token", token, { httpOnly: true });
        res.redirect('/activate');
    })
        .catch(e => {
        // console.log(`payload data error: `, e);
        console.log(`payload data error: `, e.response.errors[0].message);
        res.redirect("/signup");
    });
    // res.send("Good")
});
exports.CreateAccountPostController = CreateAccountPostController;
const LoginPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        msg: `You are signed in as @${req.body.username}`,
    });
});
exports.LoginPostController = LoginPostController;
const ActivateAccountPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.ActivateAccountPostController = ActivateAccountPostController;
