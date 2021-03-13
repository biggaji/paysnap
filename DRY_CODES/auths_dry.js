const { db } = require("../configs/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { AuthenticationError, ApolloError } = require("apollo-server-express");
const mailgun = require("mailgun-js")({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

exports.checkUser = async (email) => {
    /**
    * @author {Tobi Ajibade}
    * @param {string}
    * @returns {Promise} - A promise object
    */

    // check user in the database
    const user = await db.query('SELECT email, verified FROM paytr_users WHERE email = $1', [email]);

    return user;
}


exports.createUser = async (userdata) => {
    /**
     * @author Tobi Ajibade
     * @param {Object} - A graphql args object
     * @returns {Object} - An object of user
     */


    const { firstname, lastname, email, paytr_username, password } = userdata;

    // hashpassword and concatenate "paytr-" keyword to the username

    const hashedPassword = await bcrypt.hash(password, 10);
    const paytr_usernam = `paytr-${paytr_username}`;

    // generate verification token
    const v_token = Math.floor(Math.random() * 1000000);

    // insert data into database

    try {
        const paytr_user = await db.query(`INSERT INTO paytr_users (firstname,lastname,email,paytr_username,password,v_token) VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING firstname, lastname, email`, [firstname, lastname, email, paytr_usernam, hashedPassword, v_token]);

        const user = paytr_user.rows[0];

        // send mail to user email_address

        const mailContents = {
            from: `Paytr Support <herityjohnny14@gmail.com>`,
            to: `${user.email}`,
            subject: `Hi ${user.firstname} ${user.lastname}, please activate your Paytr account`,
            html: ` <div>
                    <h2>Account Verification</h2>
                    <p>Hello,</p>
                    <p>Thank you for choosing Paytr! Please activate your account using the verifcation code below.</p>
                    <p>${v_token}</p>
                    <p>If you do not sign up for a Paytr account, you can simply disregard this email.</p>
                    <p>Happy Transacting!</p>
                    <p>The Paytr Team</p>
                    </div>
                    <div>
                    <h3>Problems or questions?</h3>
                    <p><a href="mailto:herityjohnny14@gmail.com">support@paytr.com</a></p>
                    </div>`
        }

        // send mail contents

        mailgun.messages().send(mailContents)
            .then(mailResponse => {
                console.log("mail response - successful : ", mailResponse.id);
            })
            .catch(mailError => {
                console.log("An error occured while sending mail - error : ", mailError);
            });

        return user;
    } catch (error) {
        console.log(error)
        throw error;
    }
}


exports.activateUser = async (token) => {
    /**
     * @author Tobi Ajibade
     * @param {String} - A verification token to activate user
     * @return {Object} - A activated user object
     */

    //  take the token and verify it matches the one in the db and check if it hasn't expiried || === to null!

    const validateToken = await db.query(`SELECT v_token, paytr_id FROM paytr_users WHERE v_token = $1`, [token]);

    // check if token is not null, then update the verified property
    // else return null

    if (validateToken.rowCount > 0 && validateToken.rowCount !== 0 && validateToken.rows[0].v_token !== null) {

        // set verified to true

        const isverified = await db.query(`UPDATE paytr_users SET verified = $1 WHERE paytr_id = $2 RETURNING verified, paytr_username, paytr_id`, [true, validateToken.rows[0].paytr_id]);

        if (isverified.rows[0].verified === true) {
            // update v_token to null
            db.query(`UPDATE paytr_users SET v_token = $1 WHERE paytr_id = $2 RETURNING v_token`, [null, isverified.rows[0].paytr_id])
                .then(isUpdatedToken => {
                    console.log("Token updated : ", isUpdatedToken.rows[0].v_token);
                })
                .catch(e => {
                    console.log("Error updating token to null ", e);
                });
            return isverified.rows[0];
        } else {
            console.log('isverified is ', isverified.rows[0].verified);
            return null;
        }
    } else {
        console.log("Invalid or expired token :: dry");
        throw new AuthenticationError('Token is invalid or expiried');
        return null;
    }
}


exports.login = async (args) => {
    // do the maths
    const { email, password } = args;

    // check data from DATABASE
    const user = await db.query(`SELECT email, password FROM paytr_users WHERE email = $1 `, [email]);

    //compare password and sign with jwt
    // console.log(user)

    if (user.rowCount === 0) {
        throw new AuthenticationError(`No User with email ${email} found`);
    }

    let passwordCheck = await bcrypt.compare(password, user.rows[0].password);

    if (!passwordCheck) {
        throw new AuthenticationError("Password is Incorrect");
        return "Invalid Password";
    }

    const userData = await db.query(`SELECT paytr_id, paytr_username, verified FROM paytr_users WHERE email = $1`, [email]);

    return userData ? userData.rows[0] : null;

}

exports.getDashboardData = async (args) => {
    const { paytr_id } = args;
    // create a join table to fetch dashboard data

    //  - fetch basic user profile data first for testing

    try {
        let userData = await db.query(`SELECT firstname, lastname, email, paytr_username, paytr_balance FROM paytr_users WHERE paytr_id = $1`, [paytr_id]);
        return userData.rows[0];
    } catch (error) {
        throw new ApolloError('An error occured while fetching ')
        return null;
    }
}


exports.checkUsername = async (username) => {
    // modified username : concat @paytr- to incomming username

    let paytr_username = `paytr-${username}`;

    // search database for username

    // let user = await db.query(`SELECT paytr_username FROM paytr_users WHERE paytr_username iLIKE $1`, [`%${paytr_username}%`]);

    let user = await db.query(`SELECT paytr_username FROM paytr_users WHERE paytr_username = $1`, [paytr_username]);
    return user ? user.rows[0] : null;
}

exports.checkEmail = async (email) => {

    // search database for email

    let user = await db.query(`SELECT email FROM paytr_users WHERE email = $1`, [email]);
    return user ? user.rows[0] : null;
}