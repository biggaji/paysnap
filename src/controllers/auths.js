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
const checkUserExists_1 = require("../../@utils/checkUserExists");
const encrypter_1 = require("../../@utils/encrypter");
const signUpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let isLoggedIn = req.headers.authorization || req.cookies.isLoggedIn;
    if (isLoggedIn) {
        res.redirect("/dashboard");
    }
    else {
        res.render("signup", { pageTitle: "Sign up", server_error_msg: req.flash("error") });
    }
    ;
});
exports.signUpController = signUpController;
const signInController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let isLoggedIn = req.headers.authorization || req.cookies.isLoggedIn;
    if (isLoggedIn) {
        res.redirect("/dashboard");
    }
    else {
        res.render("login", { pageTitle: "Sign in", server_error_msg: req.flash("error") });
    }
    ;
});
exports.signInController = signInController;
const activateAccountController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let isLoggedIn = req.headers.authorization || req.cookies.isLoggedIn;
    if (isLoggedIn && isLoggedIn !== undefined) {
        res.redirect('/dashboard');
    }
    else {
        let encodedEmail = req.headers.authorization || req.cookies.ee;
        let hashedEmail, email;
        email = yield encrypter_1.decrypt(encodedEmail);
        if (encodedEmail && encodedEmail !== undefined) {
            hashedEmail = yield asteriskEmail_1.asteriskMail(email);
        }
        ;
        res.render("activate", { pageTitle: "Activate your account", hashedEmail, server_error_msg: req.flash("error") });
    }
    ;
});
exports.activateAccountController = activateAccountController;
const resetPasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("requestPasswordRequest", { pageTitle: "Request password reset" });
});
exports.resetPasswordController = resetPasswordController;
const RedenderDashboardController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get token from cookie
        let tokenPayload = req.headers.authorization || req.cookies.x_user_token;
        // get user data database
        let dashboardPayload = graphql_request_1.gql `
      query dashboardData {
        me {
          username
          fullname
          avatar
          accountbalance
          pin
          isactivated
        }
      }
    `;
        let request_header = {
            "x_user_token": tokenPayload
        };
        graphqlRequestConfig_1.graphqlClient.request(dashboardPayload, {}, request_header)
            .then(user => {
            console.log('Dashboard rendered for @ ', user.me.username);
            let { username } = user.me;
            res.render("dashboard", { pageTitle: `${username}`, dashboardData: user.me });
        })
            .catch(e => {
            console.log(`FETCH ERROR: `, e);
            if (e.response !== undefined) {
                req.flash("error", `${e.response.errors[0].message}`);
                res.redirect("/signin");
            }
            else {
                req.flash("error", `Couldn't fetch dashboard data. Please sign in`);
                res.redirect("/signin");
            }
            ;
        });
    }
    catch (e) {
        console.log("DASHBOARD_ERROR", e.message);
        req.flash("error", `An error occured while fetching dashboard`);
        res.redirect("/signin");
    }
    ;
});
exports.RedenderDashboardController = RedenderDashboardController;
const CreateAccountPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, username, country, password, fullname } = req.body;
    // mutation for create user
    try {
        let checkUser = yield checkUserExists_1.checkUserByEmail(email);
        console.log('User with email Exist ', checkUser);
        if (!checkUser) {
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
                .then((result) => __awaiter(void 0, void 0, void 0, function* () {
                console.log(`Payload data: `, result.createAccount.message);
                const { user, token } = result.createAccount;
                // encrypt email into base64 hash and name it ee in cookie
                let ee = yield encrypter_1.encrypt(user.email);
                res.cookie("ee", ee, { secure: true });
                res.cookie("x_user_token", token, { httpOnly: true });
                res.redirect('/activate');
            }))
                .catch(e => {
                // console.log(`payload data error: `, e);
                console.log(`payload data error: `, e.response.errors[0].message);
                req.flash("error", "An error occured while creating account, please try again");
                res.redirect("/signup");
            });
        }
        else {
            console.log("User exists");
            req.flash("error", "A user with this account already exist, please sign-in instead");
            res.redirect("/signup");
        }
        ;
    }
    catch (e) {
        // console.log(`An error occured checking email `, e);
        req.flash("error", "An error occured while creating account");
        res.redirect('/signup');
    }
});
exports.CreateAccountPostController = CreateAccountPostController;
const LoginPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (username.trim().length < 3 || password.trim().length < 8) {
        req.flash("error", "Incorrect username or password");
        res.redirect('/signin');
    }
    ;
    const checkUserFirst = yield checkUserExists_1.checkUserByUsername(username);
    if (!checkUserFirst) {
        console.log('There is no user yet', checkUserFirst);
        req.flash("error", "You don't have a Paysnap account");
        res.redirect('/signin');
    }
    else {
        const loginQuery = graphql_request_1.gql `
        query Signin($opts: LoginInputs!) {
          login(opts:$opts) {
            user {
              id
              isactivated
              password
            }
            token
          }
        }
    `;
        let variables = {
            opts: {
                username,
                password
            }
        };
        graphqlRequestConfig_1.graphqlClient.request(loginQuery, variables)
            .then((resp) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`login Payload `, resp.login.user.id);
            res.cookie("x_user_token", resp.login.token, { httpOnly: true });
            res.cookie('isLoggedIn', true, { httpOnly: true });
            res.clearCookie("isLoggedOut");
            res.redirect('/dashboard');
        }))
            .catch(e => {
            console.log(`Login error ,`, e);
            if (e && e.response.errors) {
                req.flash("error", e.response.errors[0].message);
                res.redirect("/signin");
            }
            else {
                req.flash("error", "An error occured during signin, please try again");
                res.redirect('/signin');
            }
        });
    }
});
exports.LoginPostController = LoginPostController;
const ActivateAccountPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    if (code === "" || code.toString().length < 6) {
        req.flash("error", "Incorrect activation Code");
        res.redirect('/activate');
    }
    else {
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
            // clear user email from cookie
            res.clearCookie("ee");
            res.cookie("isLoggedIn", true, { httpOnly: true });
            // redirect to dashboard
            res.redirect('/dashboard');
        })
            .catch(e => {
            console.log(`Activate Account error: `, e.response.errors[0].message);
            if (e && e.response.errors) {
                req.flash("error", e.response.errors[0].message);
                res.redirect('/activate');
            }
            else {
                req.flash("error", "An error occured while activating account, please try again");
                res.redirect('/activate');
            }
        });
    }
});
exports.ActivateAccountPostController = ActivateAccountPostController;
