"use strict";
// email validation check

function isValidEmail(email:string) {
    let email_regex = /[a-zA-Z0-9]+@[a-z]{1,}\W{1}[a-z]{2,}/gi;
    return email_regex.test(email);
}

// form fields that needs validating
let email = document.getElementById("mail") as HTMLInputElement;
let username = document.getElementById("username") as HTMLInputElement;
let pwd = document.getElementById("pwd") as HTMLInputElement;
let fullName = document.getElementById("full_name") as HTMLInputElement;

// error msg elements

let emailErrMsg = document.getElementById("emailErrMsg")!;
let usernameErrMsg = document.getElementById("usernameErrMsg")!;
let pwdErrMsg = document.getElementById("pwdErrMsg")!;
let fieldRequiredMsg = document.getElementById("fields_required_err_msg");

// disabled submit button
let signupBtn = document.getElementById("fbtn_submit_signup") as HTMLButtonElement;

let PAYSNAP_API_ENDPOINT = "https://api-paysnap.herokuapp.com/graphql";

async function validateFormInputs() {

    email.addEventListener('input', () => {
        if(email.value.trim() === "") {
            emailErrMsg.style.display = "block";
            emailErrMsg.innerHTML = "Email is required";
        } else if(!isValidEmail(email.value.trim())) {
            emailErrMsg.style.display = "block";
            emailErrMsg.innerHTML = "Please enter a valid email";
        } else {
            emailErrMsg.innerHTML = "Checking email...";
            console.log(checkEmail(email.value.trim()));
            return checkEmail(email.value.trim());
        };
    });

    username.addEventListener("input", () => {
        let userName = username.value.trim();
        if(userName === "") {
            usernameErrMsg.style.display = "block";
            usernameErrMsg.innerHTML = "Username is required";
        } else if (userName.length < 3) {
            usernameErrMsg.style.display = "block";
            usernameErrMsg.innerHTML = "Username must be greater than 3 characters";
        } else {
            usernameErrMsg.innerHTML = "Checking username...";
            // console.log( checkUsername(username.value.trim()));
            return checkUsername(userName);
        };
    });
    
    let password = pwd.value.trim();
    let password_regex = /[a-zA-Z]+\d{1,}\W{1,}/gi;
    let passwordTest = password_regex.test(password);

    pwd.addEventListener("input", () => {

        if(password === "") {
            pwdErrMsg.style.display = "block";
            pwdErrMsg.innerHTML = "Password is required";
        } else if (passwordTest && password.length >= 8){
            pwdErrMsg.style.display = "none";
        } else {
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

    

    

}

validateFormInputs();


// signup form
let signupForm = document.getElementById("signup") as HTMLFormElement;

// signupForm.addEventListener('submit', (e) => {
//     e.preventDefault();

//     if(email.value.trim() === "" && username.value.trim() === "" && pwd.value.trim() === "" && fullName.value.trim() === "") {
//         fieldRequiredMsg!.innerHTML = "Fields with * are required";
//     }
// })

// backend request check if email or username exists



function checkEmail(email:string) {
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
            // check user data here
            if(user.data !== null) {
                emailErrMsg.style.display = "block";
                emailErrMsg.innerHTML = "This is email is not available for use";
            } else {
                emailErrMsg.style.display = "none";
            }
          })
          .catch((e) => {
            console.log(`Email Check Error`, e.message);
          });
}

function checkUsername(username:string) {
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
            if(user.data !== null) {
                usernameErrMsg.style.display = "block";
                usernameErrMsg.innerHTML = "This username is taken";
            } else {
                usernameErrMsg.style.display = "none";
            }
          })
          .catch((e) => {
            console.log(`Username Check Error`, e.message);
          });
}