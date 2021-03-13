const { checkUser, activateUser } = require("../../DRY_CODES/auths_dry");
const Joi = require("joi");
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");


// all auths front-end routes handlers

exports.renderSignup = (req, res) => {
    res.render("signup", { pageTitle: "Create a paytr account", csrfToken: req.csrfToken(), errorMessage: req.flash('error'), successMessage: req.flash('success') });
}

exports.renderSignin = (req, res) => {
    res.render("login", { pageTitle: "Paytr login", csrfToken: req.csrfToken(), errorMessage: req.flash('error') });
}

exports.renderActivate = (req, res) => {
    const email = req.cookies.p_email;
    //hash part of password before sending to Ui
    let firstParts = email.slice(0, 2);
    let tobehashed = email.slice(2, email.indexOf('@') - email.length);
    let lastParts = email.match(/\D{1}[a-z]+\D{1}[a-z]{2,}$/gi);
    let helperArr = [];

    let splitChar = tobehashed.split("");

    // loop through and replace with *

    for (let i = 0; i < splitChar.length; i++) {
        let asterisks = splitChar[i].replace(splitChar[i], '*');
        helperArr.push(asterisks);
    }

    // concate the strind back using Array.reduce()

    function concateMail(...arr) {
        return arr.reduce((acc, curr) => {
            return acc + curr;
        });
    }

    // invoke the function

    let hashedEmail = concateMail(firstParts, ...helperArr, lastParts);

    res.render("activate", { pageTitle: "Activate your paytr account", hashedEmail: hashedEmail, csrfToken: req.csrfToken(), errorMessage: req.flash('error') });
}

exports.renderDashboard = (req, res) => {
    // const { paytr_id } = req.user;
    //fetch user info from graphql Server
    fetch(GRAPHQL_URL, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
            query: `
            query getDashboardData {
                getDashboardData {
                    firstname
                    lastname
                    paytr_username
                    paytr_balance
                }
            }
        `})
    })
        .then(resp => {
            return resp.json();
        })
        .then(userData => {
            // check if data is not null
            if (userData.data.getDashboardData !== null) {
                res.render("dashboard", { pageTitle: "dashboard", userData: userData.data.getDashboardData });
            } else {
                res.redirect('/signin');
            }
        })
        .catch(e => {
            console.log("Error occured while Fetching dashboard data ", e);
            res.redirect('/signin');
        });
}



/**
 * paytr dependecies
 */

/**
 *  Auth controllers
 * @param {object} req 
 * @param {object} res 
 */

const GRAPHQL_URL = "http://localhost:5000/graphql";

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
        password: Joi.string().pattern(new RegExp('/[a-zA-Z]+\d{1,}\W{1,}/gi')).required(),
        _csrf: Joi.string().trim().required(),
        c_password: Joi.ref('password')
    });


    const { value, error } = paytr_schema.validate(req.body);

    const { firstname, lastname, email, username, password } = value;

    if (error) {
        console.log(error.details[0].message)
    }

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
                        createPaytrAccount(input:{firstname: "${firstname}",lastname: "${lastname}",email: "${email}",paytr_username: "${username}",password: "${password}"}) {
                            firstname
                            lastname
                            email
                        }
                    }`
                })
            })
                .then(paytr_user => {
                    // convert to response to json
                    return paytr_user.json();
                })
                .then(data => {
                    // Redirect to the activation page
                    // store user email in cookie
                    res.cookie("p_email", data.data.createPaytrAccount.email, { httpOnly: true });
                    res.redirect('/activate');
                })
                .catch(e => {
                    // Error from the fetch api
                    req.flash('error', 'An error occured while processing your registration, please try again!');
                    console.log('Create-account fetch error : ', e);
                });
        } catch (e) {
            console.log("authControl-error : : ", e);
        }
    } else {
        // res.send("User Found!");
        // send back error message to signup router
        req.flash('success', 'User already exist, please login');
        res.redirect('/create_account');
    }
}

exports.activate_account = async (req, res) => {
    /**
     *
     *  
    */

    const tokenSchema = Joi.object().keys({
        activate_k: Joi.string().trim().length(6).required(),
        _csrf: Joi.string().trim().required()
    });

    const { error, value } = tokenSchema.validate(req.body);

    // check for error

    if (error) {
        console.error(error);
    } else {
        // send token to graphql Server

        const { activate_k } = value;

        fetch(GRAPHQL_URL, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                query: `
                mutation activateUser {
                    activatePaytrAccount(token: "${activate_k}") {
                        verified
                        paytr_username
                        paytr_id
                    }
                }`
            })
        })
            .then(resp => {
                // convert response to json
                // console.log(resp)
                return resp.json();
            })
            .then(activated => {
                // console.log(activated);
                if (activated.data.activatePaytrAccount !== null) {
                    // clear email from cookie`
                    res.clearCookie("p_email");
                    let { paytr_id, paytr_username, verified } = activated.data.activatePaytrAccount;
                    // sign with jwt
                    let x_token = jwt.sign({ paytr_username: paytr_username, paytr_id: paytr_id, isverified: verified }, process.env.JWT_SECRET, { expiresIn: "1d" });

                    res.cookie("x_token", x_token, { httpOnly: true, maxAge: 60 * 60 * 60 * 24 });
                    res.cookie("isLoggedIn", true, { httpOnly: true, maxAge: 60 * 60 * 60 * 24 });
                    // if verified redirect to dashboard

                    res.redirect('/dashboard');
                } else {
                    // flash error - 'Token invalid or expired';
                    // redirect to activate page
                    console.log("Invalid token");
                    req.flash('error', 'Token is invalid or expired');
                    res.redirect("/activate");
                }
            })
            .catch(e => {
                console.log("Activation error : ", e);
            })
    }
}


exports.login = async (req, res) => {
    // check if exists and validated

    let loginSchema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('/[a-zA-Z]+\d{1,}\W{1,}/gi')).required(),
        _csrf: Joi.string().trim().required()
    });

    const { errors, value } = loginSchema.validate(req.body);

    if (errors) {
        console.log(errors.details[0].message)
    }

    let { email, password } = value;

    let user = await checkUser(email);

    if (user.rowCount !== 0 && user.rows[0].verified) {
        // send mutation data
        fetch(GRAPHQL_URL, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                query: `
                mutation logUserIn {
                    login(email: "${email}",password: "${password}") {
                        paytr_id
                        paytr_username
                        verified
                    }
                }`
            })
        })
            .then(resp => {
                return resp.json();
            })
            .then(userData => {
                console.log(userData)
                let data = userData.data.login;
                let token = jwt.sign({ paytr_id: data.paytr_id, isverified: data.isverified, paytr_username: data.paytr_username }, process.env.JWT_SECRET, { expiresIn: "1d" });
                res.cookie("x_token", token, { httpOnly: true, maxAge: 60 * 60 * 60 * 24 });
                res.cookie("isLoggedIn", true, { httpOnly: true, maxAge: 60 * 60 * 60 * 24 });
                res.clearCookie("isLoggedOut");
                res.redirect('/dashboard');
            })
            .catch(e => {
                // 
                console.log(`FETCH ERROR: `, e);
                req.flash('error', 'An error occured while signing you in, please try again!')
                res.redirect('/signin');
            });
    } else if (user.rowCount !== 0 && !user.rows[0].verified) {
        // if not verified to
        // flash message please activate your account
        req.flash('error', `You need to activate your account before you can login, please check your email for an activation token sent to you`);
        res.redirect('/signin');
        console.log('You are not verified');
    } else {
        // Not a user flash create account instead
        // redirect to signin 
        console.log('You need to create an account');
        req.flash('error', 'You need to Signup first, before you can login');
        res.redirect('/signin');
    }

}

exports.logout = async (req, res) => {
    // remove cookies all cookies and set cookie is logged out to true;
    res.clearCookie("x_token");
    res.clearCookie('isLoggedIn');
    res.cookie("isLoggedOut", true, { httpOnly: true });
    res.redirect('/');
}