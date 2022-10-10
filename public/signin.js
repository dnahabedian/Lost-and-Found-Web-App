let loginButton = document.getElementById("login");
loginButton.addEventListener("click", ()=>{
    window.location.href = "https://fog-impartial-captain.glitch.me/splashscreen.html";
});


if (window.location.search == '?email=notUCD') {
  alert("Please login with a UC Davis email.");
}
