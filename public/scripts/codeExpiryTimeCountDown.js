"use strict";
function ActiavtionTokenExpiryCountDownTimer() {
    let countDownTimer = formatTokenExpiryTime();
    // set the expiry time into the local storage
    let expiryTime = window.localStorage.setItem("CODE_EXPIRES_IN", countDownTimer.toString());
    expiryTime = window.localStorage.getItem("CODE_EXPIRES_IN");
    let countDownInit = setInterval(() => {
        let currentTime = new Date().getTime();
        let timeRemaining = expiryTime - currentTime;
        // time calculations for minutes and seconds
        // divide the remaining time by 60min , then 1min
        let remainingMinute = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        // // divide the remaining time by 60sec , then 1sec
        let remainingSeconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        if (remainingMinute.toString().length === 1) {
            remainingMinute = `0${remainingMinute}`;
        }
        if (remainingSeconds.toString().length === 1) {
            remainingSeconds = `0${remainingSeconds}`;
        }
        let countDown = `${remainingMinute}:${remainingSeconds}`;
        let countDownUI = document.getElementById("countDownUI");
        countDownUI.innerHTML = countDown;
        // // if timeRemaining is less than 0, countdown down should be 00:00, then send a fetch request to update verification token to null
        if (timeRemaining < 0) {
            countDownUI.innerHTML = `00:00`;
            clearInterval(countDownInit);
        }
    }, 1000);
}
ActiavtionTokenExpiryCountDownTimer();
function formatTokenExpiryTime() {
    let cd, et, ds, ms, ts, ad, t, m, h;
    cd = new Date().toString();
    ds = cd.split(" ");
    t = ds[4];
    ts = t.split(":");
    ms = Number(ts[1]);
    h = Number(ts[0]);
    m = ms + 15;
    if (m > 60) {
        m = m - 60;
        h += 1;
        if (h > 24) {
            h = 1;
        }
    }
    if (h.toString().length === 1) {
        h = `0${h}`;
    }
    if (ms.toString().length === 1) {
        ms = `0${m}`;
    }
    ad = `${h}:${m}:${ts[2]}`;
    ds[4] = ad;
    et = ds.join(" ");
    // console.log(et)
    return new Date(et).getTime();
}
;