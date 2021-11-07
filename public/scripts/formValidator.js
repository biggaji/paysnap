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
// email validation check
function isValidEmail(email) {
    let email_regex = /[a-z0-9]+@[a-z]{1,}\W{1}[a-z]{2,}/gi;
    return email_regex.test(email);
}
// form fields that needs validating - signup
let email = document.getElementById("mail");
let username = document.getElementById("username");
let pwd = document.getElementById("pwd");
let fullName = document.getElementById("full_name");
let country = document.getElementById("full_name");
// form fields signin
let loginUsername = document.getElementById("lusername");
let loginPwd = document.getElementById("lpwd");
let loginBtn = document.getElementById("fbtn_submit_login");
// form field - activate account
let activationCode = document.getElementById("tks");
// error msg elements
let emailErrMsg = document.getElementById("emailErrMsg");
let usernameErrMsg = document.getElementById("usernameErrMsg");
let pwdErrMsg = document.getElementById("pwdErrMsg");
let client_error_msg = document.getElementById("client_error_msg");
let client_error_msg_wrapper = document.getElementById("client_error_wrapper");
let client_success_msg_wrapper = document.getElementById("client_success_wrapper");
let client_success_close_btn = document.getElementById("closeBtn");
// disabled submit button
let signupBtn = document.getElementById("fbtn_submit_signup");
let PAYSNAP_API_ENDPOINT = "https://api-paysnap.herokuapp.com/graphql";
// function to check for empty required input fields
function checkForEmptyFields(formField) {
    return formField.value.trim() !== "";
}
;
function validateFormInputs() {
    return __awaiter(this, void 0, void 0, function* () {
        if (email) {
            email.addEventListener('input', () => {
                if (email.value.trim() === "") {
                    email.style.border = "1px solid red";
                    emailErrMsg.style.display = "block";
                    emailErrMsg.innerHTML = "Email is required";
                }
                else if (!isValidEmail(email.value.trim())) {
                    emailErrMsg.style.display = "block";
                    emailErrMsg.innerHTML = "Please enter a valid email";
                }
                else {
                    emailErrMsg.innerHTML = "Checking email...";
                    email.style.border = "1px solid black";
                    return checkEmail(email.value.trim());
                }
                ;
            });
        }
        ;
        if (username) {
            username.addEventListener("input", () => {
                let userName = username.value.trim();
                if (userName === "") {
                    username.style.border = "1px solid red";
                    usernameErrMsg.style.display = "block";
                    usernameErrMsg.innerHTML = "Username is required";
                }
                else if (userName.length < 3) {
                    usernameErrMsg.style.display = "block";
                    username.style.border = "1px solid rgba(0,0,0,0.15)";
                    usernameErrMsg.innerHTML = "Username must be greater than 3 characters";
                }
                else {
                    usernameErrMsg.innerHTML = "Checking username...";
                    username.style.border = "1px solid rgba(0,0,0,0.15)";
                    return checkUsername(userName);
                }
                ;
            });
        }
        ;
        if (pwd) {
            pwd.addEventListener("input", () => {
                let password = pwd.value.trim();
                let password_regex = /^[a-zA-Z]+\d{1,}\W{1,}/gi;
                let passwordTest = password_regex.test(password);
                if (password === "" || password.length < 1) {
                    pwd.style.border = "1px solid red";
                    pwdErrMsg.style.display = "block";
                    pwdErrMsg.innerHTML = "Password is required";
                }
                else if (password.length >= 8 && passwordTest) {
                    pwdErrMsg.style.display = "none";
                    pwd.style.border = "1px solid rgba(0,0,0,0.15)";
                    // pwdErrMsg.innerHTML = "";
                }
                else {
                    pwdErrMsg.style.display = "block";
                    pwdErrMsg.innerHTML =
                        "Password must be between 8 and 30 characters long, includes at least a numeric [0-9] and non-numeric value[?.!%&*$^].";
                }
            });
        }
        ;
    });
}
;
validateFormInputs();
// forms
let signupFORM = document.getElementById("signup");
let signinFORM = document.getElementById("signin");
let activateAccountFORM = document.getElementById("activate");
if (signupBtn) {
    signupBtn.disabled = true;
}
if (signupFORM) {
    let signupFields = [];
    signupFields.push(email, pwd, username, country, fullName);
    signupFields.forEach(elem => {
        elem.addEventListener("input", () => {
            let isNotEmpty = signupFields.every(checkForEmptyFields);
            if (elem.value.trim() === "") {
                elem.style.border = "1px solid red";
                elem.placeholder = "This field is required!";
            }
            else {
                elem.style.border = "1px solid rgba(0,0,0,0.15)";
            }
            if (isNotEmpty) {
                signupBtn.disabled = false;
            }
            else {
                signupBtn.disabled = true;
            }
            ;
        });
    });
}
if (loginBtn) {
    loginBtn.disabled = true;
}
if (signinFORM) {
    let signInFields = [];
    signInFields.push(loginUsername, loginPwd);
    signInFields.forEach(inputElem => {
        inputElem.addEventListener("input", () => {
            let isNotEmpty = signInFields.every(checkForEmptyFields);
            if (isNotEmpty) {
                loginBtn.disabled = false;
            }
            else {
                loginBtn.disabled = true;
            }
        });
    });
}
;
// activationCode validation check
let activateBtn = document.getElementById("fbtn_submit_activate");
if (activationCode) {
    activationCode.addEventListener('input', () => {
        if (activationCode.value.trim().length < 6 || activationCode.value.trim().length > 6) {
            activateBtn.disabled = true;
        }
        else {
            activateBtn.disabled = false;
        }
        ;
    });
}
// close the success box when clicked
if (client_success_close_btn) {
    client_success_close_btn.addEventListener("click", () => {
        client_success_msg_wrapper.style.display = "none";
    });
}
;
// backend request check if email or username exists
function checkEmail(email) {
    fetch(PAYSNAP_API_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            query: `
                    query checkEmail{
                        checkIfEmailExist(email: "${email}") {
                            email
                        }
                    }
                `,
        }),
    })
        .then((resp) => {
        return resp.json();
    })
        .then((user) => {
        return (user.data !== null) ? true : false;
    })
        .catch((e) => {
        console.log(`Email Check Error`, e.message);
    });
}
;
function checkUsername(username) {
    fetch(PAYSNAP_API_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            query: `
                    query checkUsername{
                        checkIfUsernameExist(username: "${username}") {
                            username
                        }
                    }
                `,
        }),
    })
        .then((resp) => {
        return resp.json();
    })
        .then((user) => {
        return (user.data !== null) ? true : false;
    })
        .catch((e) => {
        console.log(`Username Check Error`, e.message);
    });
}
;
