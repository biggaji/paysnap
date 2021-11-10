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
let PAYSNAP_API_POINT = "https://api-paysnap.herokuapp.com/graphql";
// get all buttons with class name number
let pinBtns = Array.from(document.getElementsByClassName('number'));
let error_msg_notifier = document.querySelector('.error_msg');
let pin_output_display = document.querySelector(".pin_output_display");
let back_key = document.querySelector(".back_key");
let pinIsSet;
let pinInputVals = [];
let inputVals;
// An IIFE invoked when the button is clicked
(() => {
    pinBtns.forEach((element) => {
        element.addEventListener("click", () => {
            pin_output_display.value += element.innerHTML;
        });
    });
})();
// set up pin async using fetch
function setPin(pin) {
    return __awaiter(this, void 0, void 0, function* () {
        fetch(PAYSNAP_API_POINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                query: `mutation {
                setPin(pin: "${pin}") {
                    pin
                }
            }`,
            }),
        })
            .then(res => {
            return res.json();
        })
            .then(pinset => {
            if (pinset.data.setPin !== null) {
                pinIsSet = true;
            }
            else {
                pinIsSet = false;
            }
            ;
        })
            .catch(e => {
            pinIsSet = false;
        });
    });
}
;
// function that controls the setup pin form
function setPinOps() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
;
function deleteInputVals() {
    // get current values display and push them to an array, then pop() to remove last value
    let currentValues = pin_output_display.value.trim().split("");
    let valPoped = currentValues.pop();
    let newValues = currentValues.join("");
    pin_output_display.value = newValues;
}
;
// delete last input value
back_key.addEventListener("click", () => {
    deleteInputVals();
});
