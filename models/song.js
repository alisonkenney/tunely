var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SongSchema = new Schema({
	name: String,
	trackNumber: String,
});

var Song = mongoose.model('Song', SongSchema);

module.exports = Song;
//module.exports = SongSchema;