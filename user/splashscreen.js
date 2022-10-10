"use strict";

let finderButton = document.getElementById("finder-button");
let seekerButton = document.getElementById("seeker-button");

finderButton.addEventListener("click", ()=>{
    window.location.href = "https://hammerhead-glittery-ceres.glitch.me/user/views/input-finder.html"
})

seekerButton.addEventListener("click", ()=>{
    window.location.href = "https://hammerhead-glittery-ceres.glitch.me/user/views/input-seeker.html"
})

let logo = document.getElementById("logo");
logo.addEventListener("click", ()=>{
    window.location.href = "https://hammerhead-glittery-ceres.glitch.me/user/views/splashscreen.html";
});

window.onload = () => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/checkDB");
    xhr.send();
}
