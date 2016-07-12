/* CLIENT-SIDE JS
 *
 * You may edit this file as you see fit.  Try to separate different components
 * into functions and objects as needed.
 *
 */


$(document).ready(function() {
  console.log('app.js loaded!');
  $.get('/api/albums', function(data, status) {
    data.forEach(renderAlbum);
  });

 $('#search-form').on('submit', function(e) {
    e.preventDefault();

    var formData = $(this).serialize();
    console.log(formData);

    $.post('/api/albums', formData, function(album) {
      console.log(album);
      renderAlbum(album); //render server's reponse
    });
    $(this).trigger("reset"); 
  });  

  $('#albums').on('click', '.add-song', function(e) {
    console.log("im working!");
    var id = $(this).parents('.album').data('album-id');
    console.log(id);
    $('#songModal').data('album-id', id).modal();
   
  });

  $('#albums').on('click', '.delete-album', function(e) {
    var id= $(this).parents('.album').data('album-id');
    console.log('album song id',id);
    $.ajax({
      url: '/api/albums/'+ id,
      type: 'DELETE',
      success: function(result) {
        deleteAlbum(id);
      }
    });
  });

  $('#saveSong').on('click', handleNewSongSubmit);

});


// handles the modal fields and POSTing the form to the server

  function handleNewSongSubmit(e) {
    e.preventDefault();
    var albumId = $('#songModal').data('album-id');
    var songName = $('#songName').val();
    var trackNumber = $('#trackNumber').val();

    var data = {
      name: songName,
      trackNumber: trackNumber
    };
    console.log(data);
    var url = "http://localhost:3000/api/albums/" + albumId + "/songs";
     $.post(url, data, function(album) {
        rerenderAlbum(albumId, album);
     });
     //clear 
    $('#songName').val('');
    $('#trackNumber').val('');
    $('#songModal').modal('hide');     
  }  

  function rerenderAlbum(albumId, data) {
  var oldAlbum = $("div").find("[data-album-id='" + albumId + "']");
  oldAlbum.remove();
  renderAlbum(data);
  }


  function buildSongsHtml(songs) {
  var songText = "  &ndash; ";
  songs.forEach(function(song) {
     songText = songText + "(" + song.trackNumber + ") " + song.name + " &ndash; ";
  });
  var songsHtml  =
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Songs:</h4>" +
  "                         <span>" + songText + "</span>" +
  "                      </li>";
  return songsHtml;
  }

  function deleteAlbum(albumid) {
  var oldalbum = $("div").find("[data-album-id='" + albumid + "']");
  oldalbum.remove();
}

// this function takes a single album and renders it to the page
function renderAlbum(album) {
  console.log('rendering album:', album);



  var albumHtml =
  "        <!-- one album -->" +
  "        <div class='row album' data-album-id='" + album._id + "'>" +
  "          <div class='col-md-10 col-md-offset-1'>" +
  "            <div class='panel panel-default'>" +
  "              <div class='panel-body'>" +
  "              <!-- begin album internal row -->" +
  "                <div class='row'>" +
  "                  <div class='col-md-3 col-xs-12 thumbnail album-art'>" +
  "                     <img src='" + "http://placehold.it/400x400'" +  " alt='album image'>" +
  "                  </div>" +
  "                  <div class='col-md-9 col-xs-12'>" +
  "                    <ul class='list-group'>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Album Name:</h4>" +
  "                        <span class='album-name'>" + album.name + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Artist Name:</h4>" +
  "                        <span class='artist-name'>" +  album.artistName + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Released date:</h4>" +
  "                        <span class='album-releaseDate'>" + album.releaseDate + "</span>" +
  "                      </li>" +
                          buildSongsHtml(album.songs)+
  "                    </ul>" +
  "                  </div>" +
  "                </div>" +
  "                <!-- end of album internal row -->" +

  "              </div>" + // end of panel-body

  "              <div class='panel-footer'>" +
  "                <button class='btn btn-primary add-song'>Add Song</button>" +
  "                <button class='btn btn-primary delete-album'>Delete Album</button>" +
  "              </div>" +

  "            </div>" +
  "          </div>" +
  "          <!-- end one album -->";

  // render to the page with jQuery
  $('#albums').append(albumHtml);


  }
