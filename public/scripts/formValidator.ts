"use strict";
// email validation check

function isValidEmail(email:string) {
    let email_regex = /[a-z0-9]+@[a-z]{1,}\W{1}[a-z]{2,}/gi;
    return email_regex.test(email);
}

// form fields that needs validating - signup
let email = document.getElementById("mail") as HTMLInputElement;
let username = document.getElementById("username") as HTMLInputElement;
let pwd = document.getElementById("pwd") as HTMLInputElement;
let fullName = document.getElementById("full_name") as HTMLInputElement;
let country = document.getElementById("full_name") as HTMLInputElement;

// form fields signin
let loginUsername = document.getElementById("lusername") as HTMLInputElement;
let loginPwd = document.getElementById("lpwd") as HTMLInputElement;
let loginBtn = document.getElementById("fbtn_submit_login") as HTMLButtonElement;

// form field - activate account
let activationCode = document.getElementById("tks") as HTMLInputElement;

// error msg elements

let emailErrMsg = document.getElementById("emailErrMsg")!;
let usernameErrMsg = document.getElementById("usernameErrMsg")!;
let pwdErrMsg = document.getElementById("pwdErrMsg")!;
let client_error_msg = document.getElementById("client_error_msg")!;
let client_error_msg_wrapper = document.getElementById("client_error_wrapper")!;
let client_success_msg_wrapper = document.getElementById("client_success_wrapper")!;
let client_success_close_btn = document.getElementById("closeBtn") as HTMLButtonElement;

  // disabled submit button
  let signupBtn = document.getElementById(
    "fbtn_submit_signup"
  ) as HTMLButtonElement;

let PAYSNAP_API_ENDPOINT = "https://api-paysnap.herokuapp.com/graphql";

// function to check for empty required input fields
function checkForEmptyFields(formField:HTMLInputElement) {
    return formField.value.trim() !== "";
};

async function validateFormInputs() {
  if(email) {
    email.addEventListener('input', () => {
        if(email.value.trim() === "") {
            email.style.border = "1px solid red";
            emailErrMsg.style.display = "block";
            emailErrMsg.style.color = "red";
            emailErrMsg.innerHTML = "Email is required";
        } else if(!isValidEmail(email.value.trim())) {
            emailErrMsg.style.display = "block";
            emailErrMsg.style.color = "red";
            emailErrMsg.innerHTML = "Please enter a valid email";
        } else {
            emailErrMsg.style.color = "black";
            emailErrMsg.innerHTML = "Checking email...";
            email.style.border = "1px solid black";
            return checkEmail(email.value.trim());
        };
    });
  };

  if(username) {
    username.addEventListener("input", () => {
        let userName = username.value.trim();
        if(userName === "") {
            username.style.border = "1px solid red";
            usernameErrMsg.style.display = "block";
            usernameErrMsg.style.color = "red";
            usernameErrMsg.innerHTML = "Username is required";
        } else if (userName.length < 3) {
            usernameErrMsg.style.display = "block";
            usernameErrMsg.style.color = "red";
            username.style.border = "1px solid rgba(0,0,0,0.15)";
            usernameErrMsg.innerHTML = "Username must be greater than 3 characters";
        } else {
            usernameErrMsg.style.color = "black";
            usernameErrMsg.innerHTML = "Checking username...";
            username.style.border = "1px solid rgba(0,0,0,0.15)";
            return checkUsername(userName);
        };
    });
  };

    
  if(pwd) {
    pwd.addEventListener("input", () => {
    let password = pwd.value.trim();
    let password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    let passwordTest = password_regex.test(password);
          if(password === "" || password.length < 1) {
              pwd.style.border = "1px solid red";
              pwdErrMsg.style.display = "block";
              pwdErrMsg.innerHTML = "Password is required";
          } else if (password.length >= 8 && passwordTest) {
            pwdErrMsg.style.display = "none";
            pwd.style.border = "1px solid rgba(0,0,0,0.15)";
            // pwdErrMsg.innerHTML = "";
          } else {
            pwdErrMsg.style.display = "block";
            pwdErrMsg.innerHTML =
              "Password must be between 8 and 30 characters long, includes at least a numeric [0-9] and non-numeric value[?.!%&*$^].";
          }
      });
    };
};

validateFormInputs();


// forms
let signupFORM = document.getElementById("signup") as HTMLFormElement;
let signinFORM = document.getElementById("signin") as HTMLFormElement;
let activateAccountFORM= document.getElementById("activate") as HTMLFormElement;

if(signupBtn) {
  signupBtn.disabled = true;
}

if(signupFORM) {
      let signupFields:any[] = [];
      signupFields.push(email, pwd, username, country, fullName);

      signupFields.forEach(elem => {
        elem.addEventListener("input", () => {
            let isNotEmpty = signupFields.every(checkForEmptyFields);
            if(elem.value.trim() === "") {
              elem.style.border = "1px solid red";
              elem.placeholder = "This field is required!";
            } else {
              elem.style.border = "1px solid rgba(0,0,0,0.15)";
            }
          if(isNotEmpty) {
            signupBtn.disabled = false;
          } else {
            signupBtn.disabled = true;
          };
      });
  });
}


if(loginBtn) {
  loginBtn.disabled = true;
}

if(signinFORM) {
  let signInFields:any[] = [];
  signInFields.push(loginUsername, loginPwd);
  
  signInFields.forEach(inputElem => {
    inputElem.addEventListener("input", () => {
      let isNotEmpty = signInFields.every(checkForEmptyFields);
      if(isNotEmpty) {
        loginBtn.disabled = false;
      } else {
        loginBtn.disabled = true;
      }
    });
  });
};

// activationCode validation check


let activateBtn = document.getElementById("fbtn_submit_activate") as HTMLButtonElement;

if(activationCode) {
  activationCode.addEventListener('input', () => {
    if(activationCode.value.trim().length < 6 || activationCode.value.trim().length > 6) {
      activateBtn.disabled = true;
    } else {
      activateBtn.disabled = false;
    };
  });
}

// close the success box when clicked

if(client_success_close_btn) {
  client_success_close_btn.addEventListener("click", () => {
    client_success_msg_wrapper.style.display = "none";
  });
};

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
            let dataState: boolean;
            if (user.data.checkIfEmailExist !== null) {
              dataState = true;
              emailErrMsg.style.color = "red";
              emailErrMsg.innerHTML = "email is not available for use";
            } else {
              dataState = false;
              emailErrMsg.style.color = "green";
              emailErrMsg.innerHTML = "email is available";
            }
            return dataState;
          })
          .catch((e) => {
            console.log(`Email Check Error`, e.message);
            return false;
          });
};

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
            let dataState:boolean;
            if(user.data.checkIfUsernameExist !== null) {
              dataState = true;
              usernameErrMsg.style.color = "red";
              usernameErrMsg.innerHTML = "username is not available for use";
            } else {
              dataState = false;
              usernameErrMsg.style.color = "green";
              usernameErrMsg.innerHTML = "username is available";
            };
            return dataState;
          })
          .catch((e) => {
            console.log(`Username Check Error`, e.message);
            return false;
          });
};