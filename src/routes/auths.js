"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auths_1 = require("../controllers/auths");
const router = express_1.Router();
router.get('/signup', auths_1.signUpController);
router.get("/signin", auths_1.signInController);
router.get("/activate", auths_1.activateAccountController);
exports.default = router;
