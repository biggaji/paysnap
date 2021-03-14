const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server-express");

exports.checkUser = async (req, res, next) => {
    const TOKEN = await req.headers.authorization || req.cookies.x_token;
    try {
        // verify jwt token
        if (TOKEN) {
            let user = await jwt.verify(TOKEN, process.env.JWT_SECRET);
            req.user = user;
            next();
        } else {
            throw new AuthenticationError('You are unauthorized to  visit this route.')
        }
    } catch (error) {
        throw new Error('JWT ERROR: ', error);
    }
}