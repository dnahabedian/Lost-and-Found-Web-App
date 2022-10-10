// We need many modules
// some of the ones we have used before

"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require("fs");
const FormData = require("form-data");
const assets = require('./assets');
const sqlite3 = require('sqlite3');  // we'll need this later

// and some new ones related to doing the login process
const passport = require('passport');
// There are other strategies, including Facebook and Spotify
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Some modules related to cookies, which indicate that the user
// is logged in
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

// Setup passport, passing it information about what we want to do
passport.use(new GoogleStrategy(
  // object containing data to be sent to Google to kick off the login process
  // the process.env values come from the key.env file of your app
  // They won't be found unless you have put in a client ID and secret for 
  // the project you set up at Google
  {
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  // CHANGE THE FOLLOWING LINE TO USE THE NAME OF YOUR APP
  callbackURL: 'https://hammerhead-glittery-ceres.glitch.me/auth/accepted',  
  userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo', // where to go for info
  scope: ['profile', 'email']  // the information we will ask for from Google
},
  // function to call to once login is accomplished, to get info about user from Google;
  // it is defined down below.
  gotProfile));


// Start setting up the Server pipeline
const app = express();
console.log("setting up pipeline")

// take HTTP message body and put it as a string into req.body
app.use(bodyParser.urlencoded({extended: true}));

// puts cookies into req.cookies
app.use(cookieParser());

// pipeline stage that echos the url and shows the cookies, for debugging.
//app.use("/", printIncomingRequest);

// Now some stages that decrypt and use cookies

// express handles decryption of cooikes, storage of data about the session, 
// and deletes cookies when they expire
app.use(expressSession(
  { 
    secret:'bananaBread',  // a random string used for encryption of cookies
    maxAge: 6 * 60 * 60 * 1000, // Cookie time out - six hours in milliseconds
    // setting these to default values to prevent warning messages
    resave: true,
    saveUninitialized: false,
    // make a named session cookie; makes one called "connect.sid" as well
    name: "ecs162-session-cookie"
  }));

// Initializes request object for further handling by passport
app.use(passport.initialize()); 

// If there is a valid cookie, will call passport.deserializeUser()
// which is defined below.  We can use this to get user data out of
// a user database table, if we make one.
// Does nothing if there is no cookie
app.use(passport.session()); 



// The usual pipeline stages

// Public files are still serverd as usual out of /public
app.get('/*',express.static('public'));

// special case for base URL, goes to signin.html
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/signin.html');
});

// Glitch assests directory 
app.use("/assets", assets);

// stage to serve files from /user, only works if user in logged in

// If user data is populated (by deserializeUser) and the
// session cookie is present, get files out 
// of /user using a static server. 
// Otherwise, user is redirected to public splash page (/index) by
// requireLogin (defined below)
app.get('/user/*', requireUser, requireLogin, express.static('.'));




// Now the pipeline stages that handle the login process itself

// Handler for url that starts off login with Google.
// The app (in public/index.html) links to here (note not an AJAX request!)
// Kicks off login process by telling Browser to redirect to Google.
app.get('/auth/google', passport.authenticate('google'));
// The first time its called, passport.authenticate sends 302 
// response (redirect) to the Browser
// with fancy redirect URL that Browser will send to Google,
// containing request for profile, and
// using this app's client ID string to identify the app trying to log in.
// The Browser passes this on to Google, which brings up the login screen. 


// Google redirects here after user successfully logs in. 
// This second call to "passport.authenticate" will issue Server's own HTTPS 
// request to Google to access the user's profile information with the  	
// temporary key we got from Google.
// After that, it calls gotProfile, so we can, for instance, store the profile in 
// a user database table. 
// Then it will call passport.serializeUser, also defined below.
// Then it either sends a response to Google redirecting to the 
// /setcookie endpoint, below
// or, if failure, it goes back to the public splash page. 
// NOTE:  Apparently, this ends up at the failureRedirect if we
// do the revoke in gotProfile.  So, if you want to redirect somewhere
// else for a non-UCDavis ID, do it there. 
//-----------------OLD GET AUTH------------------
//app.get('/auth/accepted', 
//  passport.authenticate('google', 
//    { successRedirect: '/setcookie', failureRedirect: '/' }
//  )
//);
app.get('/auth/accepted',
  passport.authenticate('google',
      { successRedirect: '/setcookie', failureRedirect: '/?email=notUCD' } 
  )
);

// One more time! a cookie is set before redirecting
// to the protected homepage
// this route uses two middleware functions.
// requireUser is defined below; it makes sure req.user is defined
// the second one makes a public cookie called
// google-passport-example
app.get('/setcookie', requireUser,
  function(req, res) {
    // if(req.get('Referrer') && req.get('Referrer').indexOf("google.com")!=-1){
      // mark the birth of this cookie
  
      // set a public cookie; the session cookie was already set by Passport
      res.cookie('google-passport-example', new Date());
      res.redirect('/user/views/splashscreen.html');
    //} else {
    //   res.redirect('/');
    //}
  }
);


// currently not used
// using this route, we can clear the cookie and close the session
app.get('/user/logoff',
  function(req, res) {
    // clear both the public and the named session cookie
    res.clearCookie('google-passport-example');
    res.clearCookie('ecs162-session-cookie');
    res.redirect('/');
  }
);




// listen for requests :)
//var listener = app.listen(process.env.PORT, function() {
//  console.log('Your app is listening on port ' + listener.address().port);
//});


// Some functions called by the handlers in the pipeline above


// Function for debugging. Just prints the incoming URL, and calls next.
// Never sends response back. 
//function printIncomingRequest (req, res, next) {
//    console.log("Serving",req.url);
//    if (req.cookies) {
//      console.log("cookies",req.cookies)
//    }
//    next();
//}

// function that handles response from Google containint the profiles information. 
// It is called by Passport after the second time passport.authenticate
// is called (in /auth/accepted/)
function gotProfile(accessToken, refreshToken, profile, email, done) {
    //console.log("Google profile",profile);
    //console.log("Email", email);
    const regex = /ucdavis.edu/; //Regex to look for UC Davis email 
    let str = JSON.stringify(email);
    //console.log("------------THIS IS THE EMAIL STRING-------" + str) //TEMP
    let n = str.search(/ucdavis.edu/i);
   // console.log("!----THIS IS N's VALUE:----!" + n); debug temp
    let dbRowID = 0;

    // here is a good place to check if user is in DB,
    // and to store him in DB if not already there. 
    // Second arg to "done" will be passed into serializeUser,
    // should be key to get user out of database.
    if (n > 0) {
      dbRowID = 1;  // temporary! Should be the real unique
                        // key for db Row for this user in DB table.
                        // Note: cannot be zero, has to be something that evaluates to
                        // True.  
    }
  
    //console.log(dbRowID); debug temp
    done(null, dbRowID); 
  
}


// Part of Server's sesssion set-up.  
// The second operand of "done" becomes the input to deserializeUser
// on every subsequent HTTP request with this session's cookie. 
// For instance, if there was some specific profile information, or
// some user history with this Website we pull out of the user table
// using dbRowID.  But for now we'll just pass out the dbRowID itself.
passport.serializeUser((dbRowID, done) => {
    console.log("SerializeUser. Input is",dbRowID);
    done(null, dbRowID);
});

// Called by passport.session pipeline stage on every HTTP request with
// a current session cookie (so, while user is logged in)
// This time, 
// whatever we pass in the "done" callback goes into the req.user property
// and can be grabbed from there by other middleware functions
passport.deserializeUser((dbRowID, done) => {
    console.log("deserializeUser. Input is:", dbRowID);
    // here is a good place to look up user data in database using
    // dbRowID. Put whatever you want into an object. It ends up
    // as the property "user" of the "req" object. 
    let userData = {userData: "maybe data from db row goes here"};
    done(null, userData);
});

function requireUser (req, res, next) {
  console.log("require user",req.user)
  if (!req.user) {
    res.redirect('/');
  } else {
    console.log("user is",req.user);
    next();
  }
};

function requireLogin (req, res, next) {
  console.log("checking:",req.cookies);
  if (!req.cookies['ecs162-session-cookie']) {
    res.redirect('/');
  } else {
    next();
  }
};



//--------------------------------------------------

const sql = require("sqlite3").verbose();
const requestFromAPI = require("request");

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/user"));
app.use("/images", express.static("images"));

const db = new sql.Database("LostAndFound.db");

function checkDB(){
  let seekerCMD = "SELECT name FROM sqlite_master WHERE type='table' AND name='SeekerTable'";
  let finderCMD = "SELECT name FROM sqlite_master WHERE type='table' AND name='FinderTable'";
  db.get(seekerCMD, (err, val) => {
    if (val == undefined) {
      console.log("no seeker table found - creating one");
      createSeekerDB();
    }
    else {
      console.log("seeker table found");
    }
  });
  db.get(finderCMD, (err, val) => {
    if (val == undefined) {
      console.log("no finder table found - creating one");
      createFinderDB();
    }
    else {
      console.log("finder table found");
    }
  });
}

function createSeekerDB(){
  const cmd = "CREATE TABLE SeekerTable (id INT PRIMARY KEY, title TEXT, photo TEXT, category TEXT, location TEXT, date TEXT, time TEXT, comment TEXT)";
  db.run(cmd, (err) => {
    if (err) {
      console.log("Database creation failed: ", err.message);
    }
    else {
      console.log("Created seeker database");
    }
  });
}

function createFinderDB(){
  const cmd = "CREATE TABLE FinderTable (id INT PRIMARY KEY, title TEXT, photo TEXT, category TEXT, location TEXT, date TEXT, time TEXT, comment TEXT)";
  db.run(cmd, (err) => {
    if (err) {
      console.log("Database creation failed: ", err.message);
    }
    else {
      console.log("Created finder database");
    }
  });
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/signin.html");
});

app.get("/checkDB", (req, res) => {
  checkDB();
  res.send();
})

app.post("/insertFoundItem", (req, res) => {
  let post = req.body;
  let id = makeid(25);
  let cmd = "INSERT INTO FinderTable (id, title, photo, category, location, date, time, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  db.run(cmd, id, post.title, post.photo, post.category, post.location, post.date, post.time, post.comment, (err) => {
    if (err) {
      console.log("FinderTable insert error: ", err.message);
    }
    else {
      console.log("FinderTable inserted new item with id: ", id);
    }
  });
  res.send();
})

app.post("/insertSoughtItem", (req, res) => {
  let post = req.body;
  let id = makeid(25);
  let cmd = "INSERT INTO SeekerTable (id, title, photo, category, location, date, time, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  db.run(cmd, id, post.title, post.photo, post.category, post.location, post.date, post.time, post.comment, (err) => {
    if (err) {
      console.log("SeekerTable insert error: ", err.message);
    }
    else {
      console.log("SeekerTable inserted new item with id: ", id);
    }
  });
  res.send();
})


app.post("/getSeekerResults", (req, res) => {
  let filter = req.body;
  console.log("filter is: " + JSON.stringify(filter));
  let seekerResultsCMD = configureCMD("SeekerTable", filter);
  console.log(seekerResultsCMD);
  db.all(seekerResultsCMD, (err, SeekerRows) => {
    if (SeekerRows == undefined){
      console.log("no existing items found with those filters");
      res.json([]);
    } else {
      console.log(SeekerRows);
      if (Array.isArray(SeekerRows)){
        res.json(SeekerRows);
      } else {
        let tmp = [SeekerRows];
        res.json(tmp);
      }
    }
  });
})

app.post("/getFinderResults", (req, res) => {
  let filter = req.body;
  console.log("filter is: " + JSON.stringify(filter));
  let finderResultsCMD = configureCMD("FinderTable", filter);
  console.log(finderResultsCMD);
  db.all(finderResultsCMD, (err, FinderRows) => {
    if (FinderRows == undefined){
      console.log("no existing requests found with those filters");
      res.json([]);
    } else {
      console.log(FinderRows);
      if (Array.isArray(FinderRows)){
        res.json(FinderRows);
      } else {
        let tmp = [FinderRows];
        res.json(tmp);
      }
    }
  });
})

function configureCMD(table, filter){
  let dateAndTimeLine = "";
  let categoryLine = "";
  let locationLine = "";
  if (filter.location !== "" && filter.location !== undefined){
    locationLine = "location='" + filter.location + "'";
  }
  if (filter.category !== "" && filter.category !== undefined) {
    categoryLine = "category='" + filter.category + "'";
  }
  if ((filter.date1 !== "" && filter.date1 !== undefined) && (filter.time1 !== "" && filter.time1 !== undefined) && 
    (filter.date2 !== "" && filter.date2 !== undefined) && (filter.time2 !== "" && filter.time2 !== undefined)){
    dateAndTimeLine = "date BETWEEN '" + filter.date1 + "' AND '" + filter.date2 + "' AND time BETWEEN '" + filter.time1 + "' AND '" + filter.time2 + "'";
  }

  let commands = [];
  if (dateAndTimeLine !== ""){
    commands.push(dateAndTimeLine);
  }
  if (categoryLine !== ""){
    commands.push(categoryLine);
  }
  if (locationLine !== ""){
    commands.push(locationLine);
  }

  let command = "SELECT * FROM " + table;
  for (let i = 0; i < commands.length; i++){
    if (i === 0){
      command += " WHERE " + commands[i];
    }
    else {
      command += " AND " + commands[i];
    }
  }

  return command;
}

function makeid(length) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


// IMAGE UPLOADING TO SERVER
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/images')    
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
let upload = multer({storage: storage});

// Handle a post request to upload an image. 
app.post('/upload', upload.single('newImage'), function (request, response) {
  console.log("Recieved",request.file.originalname,request.file.size,"bytes")
  if(request.file) {
    // file is automatically stored in /images, 
    // even though we can't see it. 
    // We set this up when configuring multer
    sendMediaStore(request.file.originalname, request, response);
    // remove image from local storage
    fs.unlink(__dirname + '/images/' + request.file.originalname, (err) => {
      if (err) throw err;
      console.log(request.filename + ' was deleted');
  });
  }
  else throw 'error';
});


// function called when the button is pushed
// handles the upload to the media storage API
function sendMediaStore(filename, serverRequest, serverResponse) {
  let apiKey = process.env.ECS162KEY;
  if (apiKey === undefined) {
    serverResponse.status(400);
    serverResponse.send("No API key provided");
  } else {
    // we'll send the image from the server in a FormData object
    let form = new FormData();
    
    // we can stick other stuff in there too, like the apiKey
    form.append("apiKey", apiKey);
    // stick the image into the formdata object
    form.append("storeImage", fs.createReadStream(__dirname + "/images/" + filename));
    // and send it off to this URL
    form.submit("http://ecs162.org:3000/fileUploadToAPI", function(err, APIres) {
      // did we get a response from the API server at all?
      if (APIres) {
        // OK we did
        console.log("API response status", APIres.statusCode);
        // the body arrives in chunks - how gruesome!
        // this is the kind stream handling that the body-parser 
        // module handles for us in Express.  
        let body = "";
        APIres.on("data", chunk => {
          body += chunk;
        });
        APIres.on("end", () => {
          // now we have the whole body
          if (APIres.statusCode != 200) {
            serverResponse.status(400); // bad request
            serverResponse.send(" Media server says: " + body);
          } else {
            serverResponse.status(200);
            serverResponse.send(body);
          }
        });
      } else { // didn't get APIres at all
        serverResponse.status(500); // internal server error
        serverResponse.send("Media server seems to be down.");
      } // else
    });
  }
}



const listener = app.listen(process.env.PORT, function(){
    console.log("Server is listening on port " + listener.address().port);
});
