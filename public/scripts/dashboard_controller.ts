let PAYSNAP_API_POINT = "https://api-paysnap.herokuapp.com/graphql";
// get all buttons with class name number
let pinBtns =  Array.from(document.getElementsByClassName('number'));
let error_msg_notifier = document.querySelector('.error_msg') as HTMLParagraphElement; 
let pin_output_display = document.querySelector(".pin_output_display") as HTMLInputElement;
let back_key = document.querySelector(".back_key") as HTMLButtonElement;
let pinIsSet;
let pinInputVals:number[] = [];
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
async function setPin(pin: string) {
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
        if(pinset.data.setPin !== null) {
            pinIsSet = true;
        } else {
            pinIsSet = false;
        };
    })
    .catch(e => {
        pinIsSet = false;
    });
};

// function that controls the setup pin form
async function setPinOps() {
    
};

function deleteInputVals() {
    // get current values display and push them to an array, then pop() to remove last value
    let currentValues = pin_output_display.value.trim().split("");
    let valPoped = currentValues.pop();
    let newValues = currentValues.join("");
    pin_output_display.value = newValues;
};

// delete last input value
back_key.addEventListener("click", () => {
    deleteInputVals();
});