"use strict";

/**
 * @author Tobi Ajibade
 */

// Automatic insert current year into footer
const CURRENT_YEAR = new Date().getFullYear();
const FOOTER_YEAR = document.querySelector(".current_year");
FOOTER_YEAR.innerHTML = CURRENT_YEAR;

// Form validation instructions 
let email_validator_message, username_validator_message, password_validator_message, c_password_validator_message;

// validator messages container
email_validator_message = document.querySelector(".email-validator-message");
username_validator_message = document.querySelector(".username-validator-message");
password_validator_message = document.querySelector(".password-validator-message");
c_password_validator_message = document.querySelector(".c-password-validator-message");

const paytr_submit_btn = document.querySelector(".paytr_form_btn");
const paytr_firstname = document.querySelector("#fname");
const paytr_lastname = document.querySelector("#lname");
const paytr_email = document.querySelector("#mail");
const paytr_username = document.querySelector("#uname");
const paytr_password = document.querySelector("#pwd");
const paytr_c_password = document.querySelector("#cpwd");

// validate email - Ensure it matches regex for real email

paytr_email.addEventListener("input", () => {
    // validate email on input
    // let email_regex = /^\w{1,}@{1}[a-z]{2,}\D{1}[a-z]{2,}$/gi;
    let email_regex = /[a-zA-Z0-9]+@[a-z]{1,}\W{1}[a-z]{2,}/gi;
    let mailMatch = email_regex.test(paytr_email.value);

    // conditional tests
    if (paytr_email.value === "") {
        email_validator_message.style.display = "none";
    } else {
        email_validator_message.style.display = "block";
    }
    if (mailMatch) {
        email_validator_message.style.color = "black";
        email_validator_message.innerHTML = "Checking for availablity";
        return checkEmail();
    } else {
        email_validator_message.innerHTML = "Your email address should match this pattern 'example@mail.com'";
        email_validator_message.style.color = "red";
    }
});


/*validate username - Ensure it is unique and it isnt registered yet by
*making a request to the database
*/

paytr_username.addEventListener('input', () => {
    if (paytr_username.value === "") {
        username_validator_message.style.display = "none";
    } else {
        username_validator_message.style.display = "block";
        username_validator_message.style.color = "black";
        username_validator_message.innerHTML = "Checking for availablity";
    }
    if (paytr_username.value.length >= 3) {
        return checkUsername();
    } else {
        username_validator_message.innerHTML = "Username must be at least 3 characters long";
        username_validator_message.style.color = "red";
    }
});

/**
 * validate password - Ensure it matches regex - at least 8 characters long, includes at least 1 number
 * and a non numeric character  long[
 */

paytr_password.addEventListener('input', () => {

    let password_regex = /[a-zA-Z]+\d{1,}\W{1,}/gi;
    let password_test = password_regex.test(paytr_password.value);

    // conditionals
    if (paytr_password.value === "") {
        password_validator_message.style.display = "none";
    } else {
        password_validator_message.style.display = "block";
    }

    if (password_test && paytr_password.value.length >= 8 && paytr_password.value.length <= 30) {
        password_validator_message.innerHTML = "Password Validated";
        password_validator_message.style.color = "green";
    } else {
        password_validator_message.innerHTML = "Password must be between 8 and 30 characters long, includes at least a numeric e.g [0-9] and non-numeric value e.g [?.!%&*$^].";
        password_validator_message.style.color = "red";
    }
});


/**
 * Validate confirm password - Check to see that
 */

paytr_c_password.addEventListener("input", () => {

    if (paytr_c_password.value === "") {
        c_password_validator_message.style.display = "none";
    } else {
        c_password_validator_message.style.display = "block";
    }

    if (paytr_c_password.value !== paytr_password.value) {
        c_password_validator_message.innerHTML = "Password does not match";
        c_password_validator_message.style.color = "red";
    } else {
        c_password_validator_message.innerHTML = "Password matches";
        c_password_validator_message.style.color = "green";
    }
});

// disable button if any input fields are null or undefined or  ""
// paytr_submit_btn.disabled = true;
// form on submit prevent default

const signupForm = document.querySelector(".sign_up_form");
let form_msg = document.querySelector(".form_msg");

signupForm.addEventListener('submit', (e) => {
    if (paytr_firstname.value === "" || paytr_lastname.value === "" || paytr_username.value === "" || paytr_password.value === "" || paytr_c_password.value === "") {
        form_msg.innerHTML = "All fields are required";
        e.preventDefault();
    } 
    return;
})


const GRAPHQL_URL = "http://localhost:5000/graphql";

// check if email or username exist already - fetch from graphql server
function checkEmail() {
    fetch(GRAPHQL_URL, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
            query:
                `
        query checkMailExist {
            checkEmail(email: "${paytr_email.value}") {
                email
            }
        }
        `
        })
    })
        .then(email => {
            // convert to json
            return email.json()
        })
        .then(data => {
            // validate data here and return suitable message
            if (data.data.checkEmail !== null) {
                email_validator_message.innerHTML = `email is not available for use `;
                email_validator_message.style.color = "red";
            } else {
                email_validator_message.innerHTML = `email is available for use`;
                email_validator_message.style.color = "green"
            }
        })
        .catch(e => {
            console.log("email fetch error: ", e);
        })
}

// check username
function checkUsername() {
    fetch(GRAPHQL_URL, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
            query: `
            query checkUsernameExist {
                checkUsername(paytr_username: "${paytr_username.value}") {
                    paytr_username
                }
            }
        `
        })
    })
        .then(username => {
            return username.json();
        })
        .then(data => {
            // validate username and return suitable data
            if (data.data.checkUsername !== null) {
                // update ui with username message
                username_validator_message.innerHTML = `username is not available`;
                username_validator_message.style.color = "red";
            } else {
                // update username not foumd
                username_validator_message.innerHTML = `username is avaiable`;
                username_validator_message.style.color = "green";
            }
        })
        .catch(e => {
            console.log("username fetch error : ", e)
        })
}