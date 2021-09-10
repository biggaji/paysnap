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
exports.LoginPostController = exports.CreateAccountPostController = exports.RedenderDashboardController = exports.resetPasswordController = exports.activateAccountController = exports.signInController = exports.signUpController = void 0;
const signUpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("signup", { pageTitle: "Sign up" });
});
exports.signUpController = signUpController;
const signInController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("login", { pageTitle: "Sign in" });
});
exports.signInController = signInController;
const activateAccountController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("activate", { pageTitle: "Activate account" });
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
    res.json({
        "msg": `@${req.body.username}, your account has been created successfully`
    });
});
exports.CreateAccountPostController = CreateAccountPostController;
const LoginPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        msg: `You are signed in as @${req.body.username}`,
    });
});
exports.LoginPostController = LoginPostController;
