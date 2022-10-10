let existingSearchBar = document.getElementById("search-cont");
let titleInputBox = document.getElementById("title-input-box");
window.sessionStorage.clear();

window.sessionStorage.setItem("finderInputPhoto", "");

existingSearchBar.addEventListener("click", ()=>{
    window.location.href = "https://hammerhead-glittery-ceres.glitch.me/user/views/finder-mapscreen.html";
});

let logo = document.getElementById("ucd-logo");
logo.addEventListener("click", ()=>{
    window.location.href = "https://hammerhead-glittery-ceres.glitch.me/user/views/splashscreen.html";
});

let nextButton = document.getElementById("next-button");
nextButton.addEventListener("click", ()=>{
    console.log(titleInputBox.textContent)
    if (titleInputBox.textContent.replace(/\s/g, '') === ""){ // got regex help from https://stackoverflow.com/questions/7151159/javascript-regular-expression-remove-spaces
        window.alert("The 'Title' Field cannot be empty.");
        return;
    }
    window.sessionStorage.setItem("finderInputTitle", document.getElementById("title-input-box").textContent);
    window.sessionStorage.setItem("finderInputCategory", document.getElementById("category-input-box").value);
    window.sessionStorage.setItem("finderInputComment", document.getElementById("desc-input-box").textContent);

    window.location.href = "https://hammerhead-glittery-ceres.glitch.me/user/views/time-location-finder.html";
});

// UPLOAD IMAGE
document.querySelector('#imgUpload').addEventListener('change', () => {
  
    const selectedFile = document.querySelector('#imgUpload').files[0];

    // Check if user didn't select image
    if (!selectedFile){
        return;
    }

    // set key-value pair for photo in sessionStorage
    window.sessionStorage.setItem("finderInputPhoto", selectedFile.name);

    // store it in a FormData object
    const formData = new FormData();
    formData.append('newImage',selectedFile, selectedFile.name);
  
    let status = document.getElementById('upload-status');

    // build an HTTP request data structure
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload", true);
    xhr.onloadend = function(e) {
        // Get the server's response to the upload
        console.log(xhr.responseText);
       // let newImage = document.querySelector("#cardImg");
       // newImage.src = "https://postcard-app.glitch.me/images/"+selectedFile.name;
       // newImage.style.display = 'block';
       // document.querySelector('.image').classList.remove('upload');
        status.textContent = 'Uploaded ' + selectedFile.name;
    }
  
    status.textContent = 'Uploading...';
    // actually send the request
    xhr.send(formData);
});
