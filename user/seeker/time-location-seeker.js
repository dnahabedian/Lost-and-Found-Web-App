"use strict";
// remove both finder and seeker filters
window.sessionStorage.removeItem("finderResultsFilter");
window.sessionStorage.removeItem("senderResultsFilter");


var map;
var google;

window.initMap = function () {
    map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 38.537, lng: -121.754  },
    zoom: 15
  });
};

let existingSearchBar = document.getElementById("item-search");

existingSearchBar.addEventListener("click", ()=>{
    window.location.href = "https://hammerhead-glittery-ceres.glitch.me/user/views/seeker-mapscreen.html";
});

let logo = document.getElementById("ucd-logo");
logo.addEventListener("click", ()=>{
    window.location.href = "https://hammerhead-glittery-ceres.glitch.me/user/views/splashscreen.html";
});

let submitButton = document.getElementById("submit-button");
submitButton.addEventListener("click", ()=>{
  if (document.getElementById("location-input-box").value.replace(/\s/g, '') === ""){ // got regex help from https://stackoverflow.com/questions/7151159/javascript-regular-expression-remove-spaces
    alert("Must input the location the item was lost");
    return;
  }

  window.sessionStorage.setItem("seekerInputDate", document.getElementById("date").value);
  window.sessionStorage.setItem("seekerInputTime", document.getElementById("time").value);
  window.sessionStorage.setItem("seekerInputLocation", document.getElementById("location-input-box").value);
  let post = {
    "title": window.sessionStorage.getItem("seekerInputTitle"),
    "photo": window.sessionStorage.getItem("seekerInputPhoto"),
    "category": window.sessionStorage.getItem("seekerInputCategory"),
    "location": window.sessionStorage.getItem("seekerInputLocation"),
    "date": window.sessionStorage.getItem("seekerInputDate"),
    "time": window.sessionStorage.getItem("seekerInputTime"),
    "comment": window.sessionStorage.getItem("seekerInputComment")
  }
  let xhr = new XMLHttpRequest()
  xhr.open("POST", "/insertSoughtItem");
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify(post));
  xhr.onloadend = function(e) {
    window.location.href = "https://hammerhead-glittery-ceres.glitch.me/user/views/results-finder.html";
  }
})




//-------Autofill----------
// With Help from: w3schools.com/howto/howto_js_autocomplete.asp
function autocomplete (inp, arr) {
  var currentFocus;
  
  inp.addEventListener("input", function(e) {
    var a, b, i, val = this.value;
    
    closeAllLists();
    
    if (!val) {
      return false;
    }
    currentFocus = -1;
    
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    
    this.parentNode.appendChild(a);
    
    for (i = 0; i < arr.length; i++) {
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        b = document.createElement("DIV");
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        b.innerHTML += "<input type= 'hidden' value='" + arr[i] + "'>";
        
        b.addEventListener("click", function(e) {
          inp.value = this.getElementsByTagName("input")[0].value;
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
    
  });

  function closeAllLists(element) {
    var items = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < items.length; i++) {
      if (element != items[i] && element != inp) {
        items[i].parentNode.removeChild(items[i]);
      }
    }
  }
  

   document.addEventListener("click", function(e) {
    closeAllLists(e.target);
  });
}


let Buildings = ['Academic Surge', 'Activities & Recreation Center (ARC)', 'Advanced Materials Research Laboratory', 
                 'Aggie Surplus (Bargain Barn) & Custodial', 'Advanced Transportation Infrastructure Research Center', 
                 'Agriculture Field Station', 'Agriculture Service Office', 'Animal Husbandry Beef Barn', 'Animal Husbandry Feed Scales', 
                 'Animal Husbandry Sheep', 'Animal Resource Service V (AH Goat)', 'Animal Resources Service Headquarters', 
                 'Animal Science Horse Barn', 'Animal Sciences Teaching Facility 1', 'Animal Sciences Teaching Facility 2', 
                 'Ann E. Pitzer Center', 'Annual Fund Trailer', 'Aquaculture Facility Hatchery', 'Aquatic Biology & Environmental Science Bldg', 
                 'Aquatic Weed Laboratory', 'Arboretum Headquarters (Valley Oak Cottage)', 'Arboretum Teaching Nursery', 'Art Annex', 
                 'Art Building', 'Art Studio-Graduate Building', 'Asmundson Hall', 'Bainer Hall', 'Bike Barn', 'Bowley Plant Science Teaching Facility', 
                 'Briggs Hall', 'California Hall', 'California Raptor Museum', 'Center for Companion Animal Health', 'Center for Comparative Medicine', 
                 'Center for Equine Health', 'Center for Health & Environment Office & Laboratory', 'Center for Neuroscience', 
                 'Center for Vectorborne Diseases, Laboratory', 'Center for Vectorborne Diseases, Main Office', 
                 'Center for Vectorborne Diseases, Staff Offices', "Chancellor's Residence", 'Chemistry', 'Chemistry Annex', 
                 'Civil & Industrial Services', '116 A Street', 'Conference Center & Welcome Center', 'Contained Research Facility', 
                 'Cottonwood Cottage (Temporary Classroom 30)', 'Cowell Building', 'Cruess Hall', 'Dairy', 'Davis 501 Oak Ave', 
                 'Design & Construction Management (DCM)', 'Dutton Hall', 'Earth and Physical Sciences Building', 
                 'Earth & Planetary Sciences Shockwave Lab', 'East House', 'Educational Opportunity Program (EOP)', 
                 'Eichhorn Family House', 'Elderberry Cottage', 'Enology Laboratory Building', 'Environmental Horticulture', 
                 'Environmental Services Facility Headquarters', 'Equestrian Center Covered Arena', 'Everson Hall', 
                 'Facilities Mechanical Operations', 'Facilities Services', 'Facilities Structural Trailer', 'Fire & Police Building', 
                 'Fleet Services Central Garage Campus', 'FOA: 1050 Extension Center Drive', 'FPS Facility (Main Lab & Office)', 
                 'Freeborn Hall', 'Gallagher Hall', 'Gateway Parking Structure', 'Genome & Biomedical Sciences Facility', 'Geotechnical Centrifuge', 
                 'Germplasm Laboratory', 'Ghausi Hall', 'Giedt Hall', 'Gourley Clinical Teaching Center', 'Grounds', 'Music Annex', 'Guilbert House', 
                 'Hangar', 'Hangar Office', 'Haring Hall', 'Harry H. Laidlaw Jr. Honey Bee Research Facility', 'Hart Hall', 
                 'Heitman Staff Learning Center', 'Hickey Gym', 'Hoagland Annex', 'Hoagland Hall', 'Hopkins Building', 
                 'Hopkins Svcs Complex Auxiliary', 'Hopkins Svcs Complex Receiving', 'Human and Community Development Administration', 
                 'Human Resources Administration Building', 'Hunt Hall', 'Hutchison Child Development Center', 'Hutchison Hall', 'Hyatt Place', 
                 'International Center', 'International House', 'Jackson Sustainable Winery', 'John A. Jungerman Hall (formerly Crocker Nuclear Lab)', 
                 'Kemper Hall', 'Kerr Hall', 'King Hall', 'Kleiber Hall', 'Latitude Dining Commons', 'Life Sciences', 'Maddy Lab', 'Manetti Shrem Museum', 
                 'Mann Laboratory', 'Mathematical Sciences Building', 'Meat Laboratory, Cole Facility Building C', 
                 'Medical Sciences 1 B (Carlson Health Sciences Library)', 'Medical Sciences 1 C', 'Medical Sciences 1 D', 'Memorial Union', 'Meyer Hall', 
                 'Mondavi Center for the Performing Arts', 'Mondavi Center for the Performing Arts - Administration', 'Mrak Hall', 
                 'Music Building', 'Nelson Hall (University Club)', 'Neurosciences Building', 'Noel-Nordfelt Animal Science Goat Dairy and Creamery', 
                 'North Hall', 'Olson Hall', 'Orchard House', 'Outdoor Adventures', 'Parsons Seed Certification Center', 'Pavilion at the ARC', 
                 'Peter A. Rock Hall', 'Peter J. Shields Library', 'Pavilion Parking Structure', 'Physical Sciences & Engineering Library', 
                 'Physics Building', 'Plant & Environmental Sciences', 'Plant Reproductive Biology Facility', 'Pomology Field House C', 
                 'Poultry Headquarters', 'Pritchard VMTH', 'Putah Creek Lodge', 'Quad Parking Structure', 'Regan Central Commons', 'Reprographics', 
                 'Robbins Hall', 'Robbins Hall Annex', 'Robert Mondavi Institute Brewery, Winery, and Food Pilot Facility', 'Robert Mondavi Institute - North', 
                 'Robert Mondavi Institute - Sensory', 'Robert Mondavi Institute - South', 'Roessler Hall', 'Schaal Aquatic Center', 'Schalm Hall', 
                 'School of Education Building', 'Sciences Lab Building', 'Sciences Lecture Hall', 'Scrub Oak Hall (Auditorium)', 'Scrubs Cafe', 
                 'Segundo Dining Commons', 'Segundo Services Center', 'Silo', 'Silo South', 'Social Sciences & Humanities', 'Social Sciences Lecture Hall (1100)', 
                 'South Hall', 'Sprocket Annex', 'Sprocket Building', 'Sproul Hall', 'Storer Hall', 'Student Community Center', 'Student Health & Wellness Center', 
                 'Student Housing', 'Surge II', 'Surge IV (TB 200,TB 201,TB 202,TB 203)', 'Swine Teaching and Research Facility', 'TB 009', 'TB 16', 'TB 116', 
                 'TB 117', 'TB 118', 'TB 119', 'TB 120', 'TB 123', 'TB 124', 'TB 140', 'TB 188', 'TB 189', 'TB 206', 'TB 207', 'Temporary Classroom 1', 
                 'Temporary Classrooms 2 & 3', 'Tercero Services Center', 'The Barn', 'The Grove (Surge III)', 'Thermal Energy Storage', 'Thurman Laboratory', 
                 'Toomey Weight Room', 'Transportation and Parking Services', 'Trinchero Family Estates Building', 'Tupper Hall', 'UC Davis Health Stadium East', 
                 'UC Davis Health Stadium North', 'UC Davis Health Stadium North', 'UC Davis Health Stadium West', 'Unitrans Maintenance Facility', 
                 'University Extension Building', 'University House & Annex', 'University Services Building', 'Urban Forestry', 'Utilities Headquarters', 
                 'Valley Hall', 'Veihmeyer Hall', 'Vet Med 3A', 'Vet Med 3A - MPT', 'Vet Med 3B', 'Vet Med Equine Athletic Performance Lab', 
                 'Vet Med Laboratory Facility Large Animal Holding', 'Veterinary Medicine 2', 'Veterinary Medicine Student Services and Administrative Center', 
                 'Veterinary Genetics Lab', 'Viticulture Relocation C', 'Voorhies Hall', 'Walker Hall', 'Walnut Cottage', 'Walter A. Buehler Alumni Center', 
                 'Water Science & Engineering Hydraulic L2', 'Watershed Science Facility', 'Wellman Hall', 'West House', 'Western Center for Agricultural Equipment', 
                 'Western Human Nutrition Research Center (WHNRC)', 'Wickson Hall', 'Willow Cottage', 'Wright Hall', 'Wyatt Deck', 'Wyatt Pavilion', 'Young Hall', 
                 'Young Hall Annex'];

autocomplete(document.getElementById("location-input-box"), Buildings);
