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
const indexController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.authorization || req.cookies.isLoggedIn) {
        let isLoggedIn = req.headers.authorization || req.cookies.isLoggedIn;
        if (isLoggedIn && isLoggedIn !== undefined) {
            res.redirect("/dashboard");
        }
        else {
            res.render("index", {
                pageTitle: "Send money around the world to anyone, anywhere, anytime",
            });
        }
        ;
    }
    else {
        res.render("index", {
            pageTitle: "Send money around the world to anyone, anywhere, anytime"
        });
    }
    ;
});
exports.default = indexController;
