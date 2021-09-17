"use strict";
// email validation check

function isValidEmail(email:string) {
    let email_regex = /[a-zA-Z0-9]+@[a-z]{1,}\W{1}[a-z]{2,}/gi;
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

// close the success box when clicked

client_success_close_btn.addEventListener("click", () => {
  client_success_msg_wrapper.style.display = "none";
});

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
            console.log( checkUsername(username.value.trim()));
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


// forms
let signupFORM = document.getElementById("signup") as HTMLFormElement;
let signinFORM = document.getElementById("signin") as HTMLFormElement;
let activateAccountFORM= document.getElementById("activate") as HTMLFormElement;

signupFORM.addEventListener('submit', (e) => {
    e.preventDefault();

    if(email.value.trim() === "" && fullName.value.trim() === "" && username.value.trim() === "" && country.value.trim() === "" && pwd.value.trim() === "" && fullName.value.trim() === "") {
      client_error_msg_wrapper.style.display = "block";
        client_error_msg.innerHTML = "All fields are required";
    } else {
      signupFORM.submit();
    };
});


signinFORM.addEventListener('submit', (e) => {
    e.preventDefault();

    if(loginUsername.value.trim() === "" && loginPwd.value.trim() === "") {
      client_error_msg_wrapper.style.display = "block";
        client_error_msg.innerHTML = "Username and password are required to signin";
    } else {
      signinFORM.submit();
    };
});

activateAccountFORM.addEventListener('submit', (e) => {
    e.preventDefault();

    if(activationCode.value.trim() === "" && activationCode.value.trim().length < 6) {
      client_error_msg_wrapper.style.display = "block";
        client_error_msg.innerHTML = "Activation code is required";
    } else {
      activateAccountFORM.submit();
    };
});



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
             return (user.data !== null) ? true : false;
          })
          .catch((e) => {
            console.log(`Email Check Error`, e.message);
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
            return (user.data !== null) ? true : false;
          })
          .catch((e) => {
            console.log(`Username Check Error`, e.message);
          });
};
