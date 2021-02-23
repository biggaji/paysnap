const { db } = require("../configs/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mailgun = require("mailgun-js");

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
     * @param {Object} - A graphql args object
     * @returns {Array} - An array of user
     */


    const { firstname, lastname, email, paytr_username, password } = userdata;

    // hashpassword and concatnate "paytr-" keyword to the username

    const hashedPassword = await bcrypt.hash(password, 10);
    const paytr_usernam = `paytr-${paytr_username}`;

    // insert data into database

    try {
        const paytr_user = await db.query(`INSERT INTO paytr_users (firstname,lastname,email_address,paytr_username,password) VALUES ($1,$2,$3,$4,$5)
        RETURNING firstname, lastname, email_address`, [firstname, lastname, email, paytr_usernam, hashedPassword]);
        // send mail to user email_address
        // store email address in cookies for use and clear after verification
        // redirect to the activation page

        // generate verification token
        const v_token = Math.floor(Math.random() * 1000000);
        console.log(v_token.length`  ===> ${v_token}`);

        // mailgun mail



        return paytr_user.rows[0];
    } catch (error) {
        console.log(error)
        return error;
    }
}