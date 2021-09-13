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
  let greetingText: string;

  if (hourOfTheDay >= 0 && hourOfTheDay <= 11) {
    greetingText = "Good morning";
  } else if (hourOfTheDay >= 12 && hourOfTheDay <= 15) {
    greetingText = "Good afternoon";
  } else {
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
    let remainingMinute = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );

    // divide the remaining time by 60sec , then 1sec
    let remainingSeconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    let countDown = `${remainingMinute}:${remainingSeconds}`;

    let countDownUI = document.getElementById("countDownUI")!;

    countDownUI.innerHTML = countDown;

    // if timeRemaining is less than 0, countdown down should be 00:00, then send a fetch request to update verification token to null

    if (timeRemaining < 0) {
      countDownUI.innerHTML = `00:00`;
    }
  }, 1000);
}

function formatTokenExpiryTime() {
  let cd, et, ds, ms, ts, ad, t, m;

  // cd = new Date().toString();

  // ds = cd.split(" ");

  // t = ds[4];

  // ts = t.split(":");

  // ms = Number(ts[1]);

  // m = ms + 15;

  // if(m > 60) {
  //   ms = m - 60;
  // }

  // if(ms.toString().length === 1) {
  //   ms = `0${ms}`;
  // }

  // ad = `${ts[0]}:${ts[1]}:${ts[2]}`;

  // ds[4] = ad;

  // et = ds.join("")

  let dt = new Date().toString();
  let rt: any, l, o, t: any, y: any;

  y = dt.split(" ");

  let d: any = y[4];

  t = d.split(":");

  l = Number(t[1]);

  rt = l + 15;

  if (rt > 60) {
    l = rt - 60;
  }

  if (l.toString().length === 1) {
    l = `0${l}`;
  }

  // asssemble back
  o = `${t[0]}:${l}:${t[2]}`;

  y[4] = o;

  dt = y.join(" "); 

  return new Date().getTime();

}



// let dt = new Date().toString();
// let rt:any, l, o, t:any, y:any;

// y = dt.split(" ");

// let d:any = y[4];

// t = d.split(":");

// l = Number(t[1]);

// rt = l + 15;

// if(rt > 60) {
//   l = rt - 60;
// }

// if(l.toString().length === 1) {
//   l = `0${l}`;
// }

// // asssemble back
// o = `${t[0]}:${l}:${t[2]}`;

// y[4] = o;


// dt = y.join(" "); 

console.log(y)
console.log(new Date(dt).getTime());