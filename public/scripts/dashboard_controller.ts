let PAYSNAP_API_POINT = "https://api-paysnap.herokuapp.com/graphql";
// get all buttons with class name number
let pinBtns =  Array.from(document.getElementsByClassName('number'));
let error_msg_notifier = document.querySelector('.error_msg') as HTMLParagraphElement; 
let pin_output_display = document.querySelector(".pin_output_display") as HTMLInputElement;
let back_key = document.querySelector(".back_key") as HTMLButtonElement;
let setUpPinForm = document.querySelector(".setupPinForm") as HTMLFormElement;
let submitPinBtn = document.querySelector(".submit_pin") as HTMLButtonElement;
let spinLoader = document.querySelector(".spinning-circle") as HTMLImageElement;
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
    return pin_output_display.value;
})();


setUpPinForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // send pin to server asynchoronously
    submitPinBtn.style.display = "none";
    spinLoader.style.display = "block";
    // set timeout to show loader for 5secs

     setTimeout( async () => {
         await setPin(Number(pin_output_display.value.trim()));
    }, 3000);

    // remove pin popup and show success message if successful or error msg if failed
});

// set up pin async using fetch
async function setPin(pin: number) {
    console.log(pin)
    fetch(PAYSNAP_API_POINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Accept: "application/json",
      },
      body: JSON.stringify({
        query: `mutation SetTransactPin {
                setTransactionPin(pin: ${pin}) {
                  code
                  message
                  success
                  isSet
                }
            }`,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((pinset) => {
        // console.log(pinset);
        if (pinset.data.setTransactionPin !== null && pinset.data.setTransactionPin.isSet === true) {
          pinIsSet = true;
          // hide the pop pin box else display with show error
          error_msg_notifier.innerHTML = "Pin set!";
          setUpPinForm.style.display = "none";
        } else {
          pinIsSet = false;
          error_msg_notifier.innerHTML = pinset.data.setTransactionPin.message;
          setUpPinForm.style.display = "block";
          submitPinBtn.style.display = "block";
          spinLoader.style.display = "none";
        }
        return pinIsSet;
      })
      .catch((e) => {
        console.log(`Set pin error, ${e.message}`);
        pinIsSet = false;
        error_msg_notifier.innerHTML = "Failed to set pin, try again!";
        setUpPinForm.style.display = "block";
        submitPinBtn.style.display = "block";
        spinLoader.style.display = "none";
      });
};
// delete each input element, starting from the last value
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