var setSong = function(songNumber){
  if(currentSoundFile){
    currentSoundFile.stop();
  }
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {formats: ['mp3'], preload: true});
  setVolume(currentVolume);
};

var setVolume = function(volume) {
    if (currentSoundFile) {
      currentSoundFile.setVolume(volume);
    }
}

var getSongNumberCell = function(number){
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function(songNumber, songName, songLength){
   var template = '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
   var $row = $(template);

   var clickHandler = function(){

      var songNumber = parseInt($(this).attr('data-song-number'));
      if(currentlyPlayingSongNumber !== null){
          var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
          currentlyPlayingCell.html(currentlyPlayingSongNumber);
      }
      if(currentlyPlayingSongNumber !== songNumber) {
          $(this).html(pauseButtonTemplate);
          setSong(songNumber);
          currentSoundFile.play();
          updatePlayerBarSong();
      } else if (currentlyPlayingSongNumber === songNumber) {
          if(currentSoundFile.isPaused()){
            currentSoundFile.play();
            $(this).html(pauseButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPauseButton);
          } else {
            currentSoundFile.pause();
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
          }
      }
      console.log(currentSoundFile);
   };

   var onHover = function(event){
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
   };
   var offHover = function(event){
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
   };

   $row.find('.song-item-number').click(clickHandler);
   $row.hover(onHover, offHover);
   return $row;
 };

 var setCurrentAlbum = function(album) {
     currentAlbum = album;
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');

     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);

     $albumSongList.empty();

     for(var i=0;i<album.songs.length;i++){
       var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
       $albumSongList.append($newRow);
     }

 };

 var trackIndex = function(album,song){
    return album.songs.indexOf(song);
 };

 var nextSong = function(){
   var getLastSongNumber = function(index) {
       return index == 0 ? currentAlbum.songs.length : index;
   };

   var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
   // Note that we're _incrementing_ the song here
   currentSongIndex++;

   if (currentSongIndex >= currentAlbum.songs.length) {
       currentSongIndex = 0;
   }

   // Set a new current song
   setSong(currentSongIndex+1);
   currentSoundFile.play();

   // Update the Player Bar information
   updatePlayerBarSong();

   var lastSongNumber = getLastSongNumber(currentSongIndex);
   var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
   var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

   $nextSongNumberCell.html(pauseButtonTemplate);
   $lastSongNumberCell.html(lastSongNumber);
 };

 var previousSong = function(){
   var getLastSongNumber = function(index) {
       return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
   };

   var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
   // Note that we're _incrementing_ the song here
   currentSongIndex--;

   if (currentSongIndex < 0) {
       currentSongIndex = currentAlbum.songs.length - 1;
   }

   // Set a new current song
   setSong(currentSongIndex+1);
   currentSoundFile.play();

   // Update the Player Bar information
   updatePlayerBarSong();

   var lastSongNumber = getLastSongNumber(currentSongIndex);
   var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
   var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

   $previousSongNumberCell.html(pauseButtonTemplate);
   $lastSongNumberCell.html(lastSongNumber);
 };

 var togglePlayFromPlayerBar = function(){
     console.log(currentSoundFile);
     if(currentSoundFile === null){
       setSong(1);
     }
     if(currentSoundFile.isPaused()){
       currentSoundFile.play();
       var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
       currentlyPlayingCell.html(pauseButtonTemplate);
       $('.main-controls .play-pause').html(playerBarPauseButton);
     } else {
       currentSoundFile.pause();
       var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
       currentlyPlayingCell.html(playButtonTemplate);
       $('.main-controls .play-pause').html(playerBarPlayButton);
     }

 };

 var updatePlayerBarSong = function() {

    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};

 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
 var playerBarPlayButton = '<span class="ion-play"></span>';
 var playerBarPauseButton = '<span class="ion-pause"></span>';

 var currentAlbum = null;
 var currentlyPlayingSongNumber = null;
 var currentSongFromAlbum = null;
 var currentSoundFile = null;
 var currentVolume = 80;

 var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');
 var $playPauseButton = $('.main-controls .play-pause');

 $(document).ready(function() {
      setCurrentAlbum(albumPicasso);

      $previousButton.click(previousSong);
      $nextButton.click(nextSong);
      $playPauseButton.click(togglePlayFromPlayerBar);

      var index=1;
      var albumArray = [albumPicasso,albumMarconi,albumColdplay];

      document.getElementsByClassName('album-cover-art')[0].addEventListener("click", function(event) {
        setCurrentAlbum(albumArray[index%albumArray.length]);
        index++;
      });
 });
