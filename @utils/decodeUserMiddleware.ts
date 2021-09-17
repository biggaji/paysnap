import { verify } from 'jsonwebtoken';

import { NextFunction, Request, Response  } from "express";

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns object  - "A user object"
 */

export async function decodeUser(req:Request, res: Response, next:NextFunction) {
    try {
        let userToken = req.headers.authorization || req.cookies.x_user_token;
        req.user = await verify(userToken, process.env.JWT_SECRET!);
        next();
    } catch (e) {
        // handle expiry error here
        req.flash("error", "You session has expired, login again.");
        res.clearCookie("x_user_token");
        res.clearCookie("isLoggedIn");
        res.cookie("isLoggedOut", true);
        res.redirect('/signin');
    }
}