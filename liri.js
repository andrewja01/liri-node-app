require("dotenv").config();

//global variables for requiring and user inputs
var addKeys = require("./keys.js")
var request = require("request");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var fs = require("fs");
var movieName = process.argv[3];
var liriInput = process.argv[2];
var client = new Twitter(addKeys.twitter);
var spotify = new Spotify(addKeys.spotify);
var divider = ("\n----------------------------------------------------------------");





//conditional statement to check which function is being called
switch (liriInput) {

    case "movie-this":
        movieThis();
        break;

    case "spotify-this-song":
        spotifySong();
        break;

    case "my-tweets":
        myTweets();
        break;

    case "do-what-it-says":
        readFile();
        break;

    default:
        console.log("Enter one of the following: \nmovie-this ('movie title') \nspotify-this-song ('song title') \nmy-tweets \ndo-what-it-says");

};




//functions

//omdb function
function movieThis() {

    if (!movieName) {
        movieName = 'Mr. Nobody';
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=trilogy";
    var nobodyUrl = "http://www.omdbapi.com/?t=Mr.Nobody&y=&plot=short&tomatoes=true&apikey=trilogy";

    request(queryUrl, function (error, response, body) {

        //console.log(queryUrl);

        if (!error && response.statusCode === 200) {
            console.log(divider)
            console.log("\nTitle: " + JSON.parse(body).Title + "\nYear: " + JSON.parse(body).Year +
                "\nIMDB Rating: " + JSON.parse(body).Ratings[0].Value + "\nRotten Tomatoes Rating: "
                + JSON.parse(body).Ratings[1].Value + "\nCountry: " + JSON.parse(body).Country + "\nLanguage: "
                + JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot + "\nActors: " + JSON.parse(body).Actors)
            console.log(divider)
        }
    });
};

//twitter function
function myTweets(params) {
    var params = {screen_name: ''};
    client.get('statuses/user_timeline', params, function(error, tweets, response){
        if(!error) {
            console.log(tweets);
        }
    })
}
//spotify function
function spotifySong(trackTitle) {

    var trackTitle = (process.argv[3]);
    if (!trackTitle){
        trackTitle = 'The Sign';
    }
    //console.log(trackTitle);
    spotify.search({
        type: 'track',
        query: trackTitle.slice(),
        limit: 10
    }, function (err, data) {
            if (err) {
                return console.log(err);
            }
            for (var i = 0; i < data.tracks.items.length; i++) {
                var songResponse = data.tracks.items[i];
                console.log(divider);
                console.log( divider + "Artist: " + songResponse.artists[0].name + "\nSong: " + songResponse.name + "\nLink: " + songResponse.preview_url + "Album: " + songResponse.album.name + divider);
            }
        })
};

//readfile function
function readFile() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        console.log(data);
    });
};

