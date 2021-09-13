"use strict";
let PAYSNAP_API_URL = "https://api-paysnap.herokuapp.com/graphql";
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
    return greetingText;
}
/**
 * Current year picker
 */
const currentYear = new Date().getFullYear();
function ActiavtionTokenExpiryCountDownTimer() {
    let coundDownInit = setInterval(() => {
        let currentTime = new Date().getTime();
        let countDownTime = 0;
        let timeRemaining = countDownTime - currentTime;
        // time calculations for minutes and seconds
        // divide the remaining time by 60min , then 1min
        let remainingMinute = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        // divide the remaining time by 60sec , then 1sec
        let remainingSeconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        let countDown = `${remainingMinute}:${remainingSeconds}`;
        let countDownUI = document.getElementById("countDownUI");
        countDownUI.innerHTML = countDown;
        // if timeRemaining is less than 0, countdown down should be 00:00, then send a fetch request to update verification token to null
        if (timeRemaining < 0) {
            countDownUI.innerHTML = `00:00`;
        }
    }, 1000);
}
function formatTokenExpiryTime() {
    let cd, et, ds, ms, ts, ad, t, m, am;
    cd = new Date().toString();
    ds = cd.split(" ");
    t = ds[4];
    ts = t.split(":");
    ms = Number(ts[1]);
    m = ms + 15;
    if (m > 60) {
        am = m - 60;
    }
    if (am.length === 1) {
        am = `0${ms}`;
    }
    ad = `${ts[0]}:${am}:${ts[2]}`;
    ds[4] = ad;
    et = ds.join(" ");
    console.log(et);
    return new Date(et).getTime();
}
console.log(formatTokenExpiryTime());
