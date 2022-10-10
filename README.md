# Lost-and-Found-Web-App
Allowed users to enter description and picture for lost items and search a database of found items



Google Passport Example
This app is a building block for using Google's OAuth 2.0 login protocol, with the Node Passport module.

Getting set up and running
You will need to create a project on Google Cloud Services, and enable this project to do OAuth 2.0 login. As part of this process you will:

Give Google the URLs of this app, and of an intermediate route which it will use in the login process

Get a client ID and secret (these are like the API keys), and add them in the .env file. See the detailed instructions.

You also have to edit server.js to send Google the redirect address with your app's name in it. Look for where it says "CHANGE THE FOLLOWING LINE".

Files in the user/ directory are protected and available only to users who are logged in.

Files in /public are available to the whole world, as usual.

Authorship
Based on Jared Hanson's passport-google-oauth20 exmaple.

Original Glitch App Made by Fog Creek mission-control-login

# Originally made on glitch.com
