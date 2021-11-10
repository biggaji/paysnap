"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auths_1 = require("../controllers/auths");
const decodeUserMiddleware_1 = __importDefault(require("../../@utils/decodeUserMiddleware"));
const router = express_1.Router();
router.get('/signup', auths_1.signUpController);
router.get("/signin", auths_1.signInController);
router.get("/activate", decodeUserMiddleware_1.default, auths_1.activateAccountController);
router.get("/dashboard", decodeUserMiddleware_1.default, auths_1.RedenderDashboardController);
router.get("/exit", decodeUserMiddleware_1.default, auths_1.logout);
router.post('/signup', auths_1.CreateAccountPostController);
router.post("/signin", auths_1.LoginPostController);
router.post("/activate", auths_1.ActivateAccountPostController);
exports.default = router;
