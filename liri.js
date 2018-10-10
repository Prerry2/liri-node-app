require("dotenv").config();
var Spotify = require("node-spotify-api");
var request = require("request");
var moment = require("moment");
var keys = require("./keys");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);

var typeOfRequest = process.argv[2];
var requestSpecific = process.argv[3];

/* console.log(
  "\nIf there is an error the first time running the program, it'll likely be fixed by trying again... #computers"
); */
console.log(
  "\nPlease remember, if you need to use spaces in an argument, it must be enclosed in quote marks or half quote marks.\n"
);

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
      "Title: " + jsonData.Title,
      "Year: " + jsonData.Year,
      "IMDB Rating: " + jsonData.imdbRating,
      "Rotten Tomatoes Rating: " + jsonData.Ratings.Value,
      "Country of Production: " + jsonData.Country,
      "Language: " + jsonData.Language,
      "Plot: " + jsonData.Plot,
      "Actors: " + jsonData.Actors
    ].join("\n\n");
    console.log(movieData);
  });
};
var concertFn = function() {
  var queryUrl =
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
};
var spotifyFn = function() {
  if (!requestSpecific) {
    requestSpecific = "The Sign";
  }
  
  spotify.search({ type: 'track', query: requestSpecific, limit: 1}, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    var songInfo = [
      "Artist: " + data.tracks.items[0].album.artists[0].name,
      "Song: " + data.tracks.items[0].name,
      "Album: " + data.tracks.items[0].album.name,
      "URL: " + data.tracks.items[0].external_urls.spotify
    ].join("\n\n");
  console.log(songInfo); 
  });
};

var whatItSaysArray = [];
var ifBlock = function(type) {
  if (type === "movie-this") {
    console.log("Movie selected");
    movieFn();
  } else if (type === "spotify-this-song") {
    console.log("Spotify selected");
    spotifyFn();
  } else if (type === "concert-this") {
    console.log("Concert selected");
    concertFn();
  } else {
    console.log(
      "Syntax error: typeOfRequest " +
        typeOfRequest +
        " is NOT an accepted argument. \nTry 'concert-this', 'movie-this', 'spotify-this', or 'do-what-it-says'"
    );
  }
};

if (typeOfRequest === "do-what-it-says") {
  console.log("Just DO IT! Don't let your dreams be dreams!");
  var whatItSaysArray = [];
  fs.readFile("random.txt", "ascii", function(err, data) {
    if (err) {
      return console.log(err);
    }
    whatItSaysArray = data.split(",");
    requestSpecific = whatItSaysArray[1]
    ifBlock(whatItSaysArray[0])
  });
  
  // Inserted delay to fix issues with .then not working and variables above not being set quickly enough...
  // No, I have no idea why the two delays are BOTH necessary for this whole thing to work...
} else {
  ifBlock(typeOfRequest);
}
