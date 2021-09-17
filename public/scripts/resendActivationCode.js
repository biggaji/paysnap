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
let encodeEmail = document.cookie.split("=");
let decodeEmail = decodeEncodedValue(encodedEmail[1]);
let resend_code_btn = document.getElementById("resend_code_trigger");
let activate_error_wrapper = document.getElementById("client_error_wrapper");
let activate_error_msg = document.getElementById("client_error_msg");
let activate_success_wrapper = document.getElementById("client_success_wrapper");
let activate_success_msg = document.getElementById("client_success_msg");
resend_code_btn.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    let codeSent = yield resendActivationCode(decodeEmail);
    if (codeSent) {
        // flash a success message for notification
        // store a boolean value in localstorage so it can be checked
        // call the countDown timer function to restart or reload page
        activate_success_wrapper.style.display = "block";
        activate_success_msg.innerHTML = "Activation code sent.";
        let codeSentBool = window.localStorage.setItem("codeSentBool", "true");
        // update ui
    }
    else {
        // flash not sent error msg
        activate_error_wrapper.style.display = "block";
        activate_error_msg.innerHTML = "Activation code not sent.";
    }
}));
/**
 *
 * @param email - fetch user email from secure encrypted cookie
 * @returns boolean true|false
 */
let PAYSNAP_API = "https://api-paysnap.herokuapp.com/graphql";
function resendActivationCode(email) {
    return new Promise((resolve, reject) => {
        fetch(PAYSNAP_API, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                query: `
              query requestActivationCode {
                  resendActivationCode(email:"${email}") {
                      code
                      success
                      message
                      activation_code
                  }
              }
          `,
            }),
        })
            .then((resp) => {
            return resp.json();
        })
            .then((user) => {
            resolve((user.data !== null &&
                user.data.resendActivationCode.activation_code !== null)
                ? true
                : false);
        })
            .catch((e) => {
            console.log(`RESEND_ACTIVATION_CODE_ERROR`, e.message);
            reject(`RESEND_ACTIVATION_CODE_PROMISE_ERROR: ${e}`);
        });
    });
}
;
/**
 *
 * @param encoded
 * @returns string - A decoded value from a ASCII hash
 */
function decodeEncodedValue(encoded) {
    let rephraseValue = window.decodeURIComponent(encoded);
    let decodedValue = window.atob(rephraseValue);
    return decodedValue;
}
