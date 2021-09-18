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
const jsonwebtoken_1 = require("jsonwebtoken");
/**
 *
 * @param req
 * @param res
 * @param next
 * @returns object  - "A user object"
 */
function decodeUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let userToken = req.headers.authorization || req.cookies.x_user_token;
        try {
            if (userToken) {
                let user = yield jsonwebtoken_1.verify(userToken, process.env.JWT_SECRET);
                req.user = user;
                next();
            }
        }
        catch (e) {
            // handle expiry error here
            console.log(e);
            req.flash("error", "You session has expired, login again.");
            res.clearCookie("x_user_token");
            res.clearCookie("isLoggedIn");
            res.cookie("isLoggedOut", true);
            res.redirect('/signin');
        }
    });
}
exports.default = decodeUser;
