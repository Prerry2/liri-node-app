require("dotenv").config();
var Spotify = require("node-spotify-api");
var request = require("request");
var moment = require("moment");
var keys = require("./keys");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);

var typeOfRequest = process.argv[2];
var requestSpecific = process.argv[3];

console.log(
  "If there is an error the first time running the program, it'll likely be fixed by trying again... #computers"
);
if (typeOfRequest === "do-what-it-says") {
  console.log("Just DO IT! Don't let your dreams be dreams!");
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
  }, 50);
  setTimeout(ifBlock(), 60);
  // Inserted delay to fix issues with .then not working and variables above not being set quickly enough...
  // No, I have no idea why the two delays are BOTH necessary for this whole thing to work...
} else {
  ifBlock()
}

var movieFn = function() {
  if (!requestSpecific) {
    requestSpecific = "Mr. Nobody";
  }
  var queryUrl =
    "http://www.omdbapi.com/?t=" +
    requestSpecific +
    "&y=&plot=short&apikey=trilogy";
  request(queryUrl, function(error, _, body) {
    if (error) {
      console.log(error);
    }
    var jsonData = JSON.parse(body);
    var movieData = [
      "Title: " + jsonData[0].Title,
      "Year: " + jsonData[0].Year,
      "IMDB Rating: " + jsonData[0].imdbRating,
      "Rotten Tomatoes Rating: " + jsonData[0].Ratings[1].Value,
      "Country of Production: " + jsonData[0].Country,
      "Language: " + jsonData[0].Language,
      "Plot: " + jsonData[0].Plot,
      "Actors: " + jsonData[0].Actors
    ].join("\n\n");
    console.log(movieData);
  });}
var concertFn = function () {var queryUrl =
    "https://rest.bandsintown.com/artists/" +
    requestSpecific +
    "/events?app_id=codingbootcamp";
  request(queryUrl, function(error, _, body) {
    if (error) {
      console.log(error);
    }
    var jsonData = JSON.parse(body);
    var concertData = [
      "Venue name: " + jsonData[0].venue.name,
      "Location: " + jsonData[0].venue.city + ", " + jsonData[0].venue.region,
      "Date: " + moment(jsonData[0].datetime).format("MM/DD/YYYY")
    ].join("\n\n");
    console.log(concertData);
  });
} 
var spotifyFn = function () {
  
}


var ifBlock = function() {
  if (typeOfRequest === "movie-this") {
    console.log("Movie selected");
    movieFn()
  } else if (typeOfRequest === "spotify-this-song") {
    console.log("Spotify selected");
    spotifyFn()
  } else if (typeOfRequest === "concert-this") {
    console.log("Concert selected");
    concertFn()
  } else {
  console.log(
    "Syntax error: typeOfRequest " +
      typeOfRequest +
      " is NOT an accepted argument. \nTry 'concert-this', 'movie-this', 'spotify-this', or 'do-what-it-says'"
  );
  }
}
