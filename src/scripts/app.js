function dumentReady(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState !== 'loading') {
        fn();
      }
    });
  }
}

function addEventListener(el, eventName, handler) {
  if (el.addEventListener) {
    el.addEventListener(eventName, handler);
  } else {
    el.attachEvent('on' + eventName, function(){
      handler.call(el);
    });
  }
}

function addClass(el, className) {
  if (el.classList) {
    el.classList.add(className);
  } else {
    el.className += ' ' + className;
  }
}

function removeClass(el, className) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
}


// main
function initPlayer() {
  let player = document.getElementsByClassName('js-player')[0];
  let playBtn = document.getElementsByClassName('js-play-btn')[0];
  let singerEl = document.getElementsByClassName('js-singer')[0];
  let songEl = document.getElementsByClassName('js-song')[0];
  let oldSong;
  let oldSinger;


  window.newSongData = function newSongData(data) {
    if (oldSinger !== data[0].artist) {
      singerEl.innerHTML = data[0].artist;
      oldSinger = data[0].artist;
    }

    if (oldSong !== data[0].title) {
      songEl.innerHTML = data[0].title;
      oldSong = data[0].title;
    }
  };


  function createJsTag() {
    let old = window.document.getElementById('js-data-tag');
    old && document.body.removeChild(old);
    let script   = document.createElement('script');
    script.src   = 'https://jsonp.afeld.me/?callback=newSongData&url=http://mjoy.ua/radio/station/urban-space-radio/playlist.json';
    script.id  = 'js-data-tag';
    document.body.appendChild(script);
  }
  createJsTag();
  setInterval(createJsTag, 5000);

  if (player.paused) {
    removeClass(playBtn, 'state-paying');
  }

  addEventListener(playBtn, 'click', function() {
    if (player.paused) {
      player.play();
      addClass(playBtn, 'state-paying');
    } else {
      player.pause();
      removeClass(playBtn, 'state-paying');
    }
  });
}

dumentReady(initPlayer);
