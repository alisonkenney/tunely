// SERVER-SIDE JAVASCRIPT

//require express in our app
var express = require('express');
// generate a new express app and call it 'app'
var app = express();

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

//body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

/************
 * DATABASE *
 ************/

var db = require('./models');


/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', function api_index (req, res){
  res.json({
    message: "Welcome to tunely!",
    documentation_url: "https://github.com/tgaff/tunely/api.md",
    base_url: "http://tunely.herokuapp.com",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
});

app.get('/api/albums', function album_index(req, res){
  db.Album.find({}, function(err, albums) {
    if(err){ return console.log("error :", err);}
    res.json(albums);
  });
});

//CREATE AN ALBUM
app.post('/api/albums', function create_album(req,res){
  var output = req.body;
  console.log(output);
  res.json(output);
  var genres = output.genres;
  var array = genres.split(",");
  genres = array;

  db.Album.create(req.body, function (err, album) {
    if(err) {console.log('error', err); }
      console.log(album);
      res.json(album);
  });
});

//CREATE A SONG
app.post('/api/albums/:album_id/songs', function create_song(req, res) {
  var body = req.body;
  var albumId = req.params.album_id;

  db.Album.findOne({_id: albumId}, function (err, album) {
    if (err){
      res.send("Error: "+err);
    }

    var song = new db.Song(body);
    album.songs.push(song);
    album.save();
    res.json(album);
  });

});

//BY ID
app.get('/api/albums/:id', function album_by_id(req, res){
 var id = req.params.id;
 db.Album.findOne({_id: id}, function (err, album) {
   res.json(album);
 });
});

//DELETE
app.delete('/api/albums/:id', function delete_song(req, res){
  var id = req.params.id;
  db.Album.findOne({_id: id}).remove(function () {
    res.send("Success");
  });
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
