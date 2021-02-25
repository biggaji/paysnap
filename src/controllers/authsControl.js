// all auths front-end routes handlers

exports.renderSignup = (req, res) => {
    res.render("signup", { pageTitle: "Create a paytr account", csrfToken: req.csrfToken() });
}

exports.renderSignin = (req, res) => {
    res.render("login", { pageTitle: "Paytr login" });
}

exports.renderActivate = (req, res) => {
    res.render("activate", { pageTitle: "Activate your paytr account" });
}

exports.renderDashboard = (req, res) => {
    res.render("dashboard", { pageTitle: "dashboard" });
}



/**
 * paytr dependecies
 */

const { checkUser, activateUser } = require("../../DRY_CODES/auths_dry");
const Joi = require("joi");
const fetch = require("node-fetch");
/**
 *  Auth controllers
 * @param {object} req 
 * @param {object} res 
 */

const GRAPHQL_URL = "localhost:5000/graphql";

exports.create_account = async (req, res) => {
    /**
     * Create a paytr user account
     * @author Tobi Ajibade
     * @param {Object} - Get data from the request object
     * @returns {Array} - Array data of user
     */

    const paytr_schema = Joi.object().keys({
        firstname: Joi.string().trim().required(),
        lastname: Joi.string().trim().required(),
        email: Joi.string().email().required(),
        username: Joi.string().trim().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required(),
        _csrf: Joi.string().trim().required(),
        c_password: Joi.ref('password')
    });


    const { value, error } = paytr_schema.validate(req.body);

    const { firstname, lastname, email, username, password } = value;

    // check if users exists 

    const user = await checkUser(email);

    if (user.rowCount === 0 && user.rows.length === 0) {
        // User not found, --> register the new user
        try {
            fetch(GRAPHQL_URL, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    query: `mutation createUser {
                        createPaytrUser(input:{firstname: "${firstname}",lastname: "${lastname}",email: "${email}",paytr_username: "${username}",password: "${password}"}) {
                            firstname
                            lastname
                            email
                        }
                    }`
                })
            })
                .then(paytr_user => {
                    // convert to response to json
                    // Redirect to the activation page
                    // store user email in cookie
                })
                .catch(e => {
                    // Error from the fetch api
                    console.log("Fetch api error ::", e);
                });
        } catch (e) {
            console.log("authControl-error : : ", e);
        }
    } else {
        // res.send("User Found!");
        res.redirect('/');
    }
}

exports.activate_account = async (req, res) => {
    /**
     *
     *  
    */

    const tokenSchema = Joi.object().keys({
        token: Joi.string().trim().length(6)
    });

    const { error, value } = tokenSchema.validate(req.body);

    // check for error

    if (error) {
        console.log(error);
    } else {
        // send token to graphql Server

        const { token } = value;

        fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            data: JSON.stringify({
                query: `
                mutation activateUser {
                    activatePaytrAccount(token: "${token}") {
                        verified
                    }
                }`
            })
        })
            .then(verified => {
                // sign with jwt
                // if verified redirect to dashboard
            })
            .catch(e => {
                console.log("Activation error : ", e);
            })
    }
}
