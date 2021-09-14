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
    let hashedEmail;
    if (email && email !== undefined) {
        hashedEmail = yield asteriskEmail_1.asteriskMail(email);
    }
    // console.log(email)
    res.render("activate", { pageTitle: "Activate account", hashedEmail });
});
exports.activateAccountController = activateAccountController;
const resetPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("requestPasswordRequest", { pageTitle: "Request password reset" });
});
exports.resetPasswordController = resetPasswordController;
const RedenderDashboardController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get user data database
    res.render("dashboard", { pageTitle: "", dashboard: "", username: "biggaji" });
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
    const { code } = req.body;
    console.log(code);
    // get token form cookie
    let tokenPayload = (yield req.headers.authorization) || req.cookies.x_user_token;
    // send token to database
    const activateAccountMutation = graphql_request_1.gql `
      mutation activateAccount($code: String!) {
        activateAccount(code: $code) {
          code
          message
          success
          user {
            isactivated
          }
        }
      }
  `;
    const variables = {
        code
    };
    const request_header = {
        "x_user_token": tokenPayload
    };
    graphqlRequestConfig_1.graphqlClient.request(activateAccountMutation, variables, request_header)
        .then(resp => {
        let data = resp.activateAccount;
        console.log(`Account activated, `, data.user.isactivated);
        // clear users email from cookie
        res.clearCookie("email");
        // redirect to dashboard
        res.redirect('/dashboard');
    })
        .catch(e => {
        console.log(`Activate Account error: `, e);
        res.redirect('/activate');
    });
});
exports.ActivateAccountPostController = ActivateAccountPostController;
