/**
 * Mixing Desk
 * -----------
 */
function Desk(band) {

  var _this = this;

  this.band = arguments;
  this.path = 'audio/';
  this.tracks = [];
  this.playing = false;

  // trigger play() on each <audio> element
  this.play = function() {
    this.playing = true;
    for(x in _this.tracks) {
      _this.tracks[x].play();
    }
  };

  // trigger pause() and reset head on each <audio> element 
  this.stop = function() {
    this.playing = false;
    for(x in _this.tracks) {
      _this.tracks[x].pause();
      _this.tracks[x].currentTime = 0;
    }
  };

  // toggle play/stop including button style changes
  this.togglePlay = function(e) {
    var $play = $('#play');
    if(_this.playing) {
      _this.stop();
      $play.html('Play').parent().removeClass('primary').addClass('secondary');
    } else {
      _this.play();
      $play.html('Stop').parent().removeClass('secondary').addClass('primary');
    }
  };

  // toggle loop bool on each <audio> element
  this.toggleLoop = function() {
    var loop = !$(this).children('input').is(':checked');
    for(x in _this.tracks) {
      _this.tracks[x].loop = loop;
    }
  };

  // adjust volume property of trackusing data-track attribute
  this.track = function(event, ui) {
    var $this = $(this),
        track = $this.attr('data-track'),
        val = $this.slider('value') / 100;

    _this.tracks[track - 1].volume = val;
  };

  // load each audio file, recursively continuing to the next once fully loaded
  this.load = function(i) {

    var func = arguments.callee,
        audio = new Audio,
        ext = !!audio.canPlayType('audio/ogg') ? 'ogg' : 'mp3';
    
    audio.loop = false;
    audio.volume = 0.6;
    audio.src = _this.path+_this.band[i]+'.'+ext;

    _this.tracks[i] = audio;

    // when track has ended toggle play button
    _this.tracks[i].addEventListener('ended', function() {
      if(_this.playing) {
        _this.togglePlay();
      }
    });

    _this.tracks[i].addEventListener('canplaythrough', function() {

      // once all files load we can bind up the play button
      if(i >= _this.band.length - 1) {  
        $('#play').parent().addClass('secondary').removeClass('primary');
        $('#play').html('Play').click(function(e) {
          e.preventDefault();
          _this.togglePlay();
        });

        return;
      }
      // load next audio file 
      func(++i);
    });
  };

  // self invoking init method
  this.init = function() {

    // start load process with audio file 0
    _this.load(0);

    // jquery ui sliders to adjust track volume
    $('.slider').slider({
      orientation: "vertical",
      range: "min",
      min: 0,
      max: 100,
      value: 60,
      slide: _this.track
    });

    // loop checkbox
    $('label[for="loop"]').click(_this.toggleLoop);
  }();

}