"use strict";
let greeting_text = document.getElementById("greeting_text_UI");
/**
 * Daytime greeting switch
 */
function DaytimeGreetingSwitch() {
    /**
     * @returns string
     *  0AM - 11:59AM "Good morning" 12PM - 15:59PM "Good afternoon" 16PM - 23PM "Good evening"
     */
    let hourOfTheDay = new Date().getHours();
    let greetingText;
    if (hourOfTheDay >= 0 && hourOfTheDay <= 11) {
        greetingText = "Good morning";
    }
    else if (hourOfTheDay >= 12 && hourOfTheDay <= 15) {
        greetingText = "Good afternoon";
    }
    else {
        greetingText = "Good evening";
    }
    greeting_text.innerHTML = greetingText;
    // return greetingText;
}
DaytimeGreetingSwitch();
