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
    let email_regex = /[a-zA-Z0-9]+@[a-z]{1,}\W{1}[a-z]{2,}/gi;
    return email_regex.test(email);
}
// form fields that needs validating
let email = document.getElementById("mail");
let username = document.getElementById("username");
let pwd = document.getElementById("pwd");
let fullName = document.getElementById("full_name");
// error msg elements
let emailErrMsg = document.getElementById("emailErrMsg");
let usernameErrMsg = document.getElementById("usernameErrMsg");
let pwdErrMsg = document.getElementById("pwdErrMsg");
let fieldRequiredMsg = document.getElementById("fields_required_err_msg");
// disabled submit button
let signupBtn = document.getElementById("fbtn_submit_signup");
let PAYSNAP_API_ENDPOINT = "https://api-paysnap.herokuapp.com/graphql";
function validateFormInputs() {
    return __awaiter(this, void 0, void 0, function* () {
        email.addEventListener('input', () => {
            if (email.value.trim() === "") {
                emailErrMsg.style.display = "block";
                emailErrMsg.innerHTML = "Email is required";
            }
            else if (!isValidEmail(email.value.trim())) {
                emailErrMsg.style.display = "block";
                emailErrMsg.innerHTML = "Please enter a valid email";
            }
            else {
                emailErrMsg.innerHTML = "Checking email...";
                console.log(checkEmail(email.value.trim()));
                return checkEmail(email.value.trim());
            }
            ;
        });
        username.addEventListener("input", () => {
            let userName = username.value.trim();
            if (userName === "") {
                usernameErrMsg.style.display = "block";
                usernameErrMsg.innerHTML = "Username is required";
            }
            else if (userName.length < 3) {
                usernameErrMsg.style.display = "block";
                usernameErrMsg.innerHTML = "Username must be greater than 3 characters";
            }
            else {
                usernameErrMsg.innerHTML = "Checking username...";
                console.log(checkUsername(username.value.trim()));
                return checkUsername(userName);
            }
            ;
        });
        let password = pwd.value.trim();
        let password_regex = /[a-zA-Z]+\d{1,}\W{1,}/gi;
        let passwordTest = password_regex.test(password);
        pwd.addEventListener("input", () => {
            if (password === "") {
                pwdErrMsg.style.display = "block";
                pwdErrMsg.innerHTML = "Password is required";
            }
            else if (passwordTest && password.length >= 8) {
                pwdErrMsg.style.display = "none";
            }
            else {
                pwdErrMsg.style.display = "block";
                pwdErrMsg.innerHTML =
                    "Password must be at least 8 characters long, include at least a one number and a special character (?.!%&*$^)";
            }
        });
        // let requiredFields = [email, username, pwd, fullName];
        // requiredFields.forEach(f => {
        //     f.addEventListener("input", () => {
        //         if(f.value.trim() === ""  || f.value.length < 1) {
        //             signupBtn.disabled = true;
        //             // fieldRequiredMsg!.innerHTML = "These fields are required";
        //         } else {
        //             // fieldRequiredMsg!.innerHTML = "";
        //             signupBtn.disabled = false;
        //         }
        //     }) 
        // })
    });
}
validateFormInputs();
// signup form
let signupForm = document.getElementById("signup");
// signupForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     if(email.value.trim() === "" && username.value.trim() === "" && pwd.value.trim() === "" && fullName.value.trim() === "") {
//         fieldRequiredMsg!.innerHTML = "Fields with * are required";
//     }
// })
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
        // // check user data here
        if (user.data !== null && user.data.checkIfEmailExist.email === email) {
            // console.log(user.data.checkIfEmailExist.email);
            //     emailErrMsg.style.display = "block";
            //     emailErrMsg.innerHTML = "This is email is not available for use";
            return true;
        }
        else {
            return false;
        }
    })
        .catch((e) => {
        console.log(`Email Check Error`, e.message);
    });
}
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
        // check user data here
        console.log(user.data);
        if (user.data !== null) {
            //     usernameErrMsg.style.display = "block";
            //     usernameErrMsg.innerHTML = "This username is taken";
            // } else {
            //     usernameErrMsg.style.display = "none";
            return true;
        }
        else {
            return false;
        }
    })
        .catch((e) => {
        console.log(`Username Check Error`, e.message);
    });
}
