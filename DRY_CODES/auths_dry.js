const { db } = require("../configs/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mailgun = require("mailgun-js")({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

exports.checkUser = async (email) => {
    /**
    * @author {Tobi Ajibade}
    * @param {string}
    * @returns {Promise} - A promise object
    */

    // check user in the database
    const user = await db.query('SELECT * FROM paytr_users WHERE email_address = $1', [email]);

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

    //  take the schema and verify it matches the one in the db and check if it hasnt expiried!

    const v_token = await db.query(`SELECT v_token FROM paytr_users WHERE v_token = $1`, [token]);

    console.log(v_token.rows[0].v_token);

    // check if token is not null, then update the verified property
    // else return null
}