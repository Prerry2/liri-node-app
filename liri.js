require("dotenv").config();
var Spotify = require("node-spotify-api");
var request = require("request");
var moment = require("moment");
var keys = require("./keys");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");

var typeOfRequest = process.argv[2];
var requestSpecific = process.argv[3];

if (typeOfRequest === "do-what-it-says") {
  var whatItSaysArray = [];
  fs.readFile("random.txt", "ascii", function(err, data) {
    if (err) {
      return console.log(err);
    }
    whatItSaysArray = data.split(",");
  });
  setTimeout(function() {
  // console.log(whatItSaysArray);
  typeOfRequest = whatItSaysArray[0];
  requestSpecific = whatItSaysArray[1];
  // console.log(typeOfRequest + " " + requestSpecific);
}, 50); }
// Inserted delay to fix issues with .then not working and variables above not being set quickly enough...
setTimeout(function() {
if (typeOfRequest === "movie-this") {
  var queryUrl =
    "http://www.omdbapi.com/?t=" +
    requestSpecific +
    "&y=&plot=short&apikey=trilogy";
  request(queryUrl, function(error, response, body) {
    if (error) {
      console.log(error);
    }
    // Do stuff here
  });
} else if (typeOfRequest === "spotify-this-song") {
} else if (typeOfRequest === "concert-this") {
  var queryUrl =
    "https://rest.bandsintown.com/artists/" +
    requestSpecific +
    "/events?app_id=codingbootcamp";
  request(queryUrl, function(error, response, body) {
    if (error) {
      console.log(error);
    }
    // Do stuff here
  });
} else {
  console.log(
    "Syntax error: typeOfRequest " +
      typeOfRequest +
      " is NOT an accepted argument. \nTry 'concert-this', 'movie-this', 'spotify-this', or 'do-what-it-says'"
  );
}
}, 100)