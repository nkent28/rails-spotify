// Load all the channels within this directory and all subdirectories.
// Channel files must be named *_channel.js.

const channels = require.context('.', true, /_channel\.js$/)
channels.keys().forEach(channels)

const APIController = (function() {

  const clientId = '';
  const clientSecret = '';

  // private methods
  const _getToken = async () => {

    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Authorization' : 'Basic' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
      });

      const data = await result.json();
      return data.access_token;
    }

  const _getGenres = async (token) => {

    const result = await fetch('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer' + token}
    });

    const data = await result.json();
    return data.categories.items;
  }

  const _getPlaylistByGenre = async (token, genreId) => {

    const limit = 10;

    const result = await fetch('https://api.spotify.com/v1/browse/categories/$[genreId]/playlists?limit=${limit}', {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer' + token}
    });

    const data = await result.json();
    return data.playlists.items;
  }

    const _getTracks = async (token, tracksEndPoint) => {

      const limit = 10;

      const result = await fetch(`${tracksEndPoint}?limit-${limit}`, {
          method: 'GET',
          headers: { 'Authorization' : 'Bearer' + token}
      });

      const data = result.json();
      return data.items;
    }

    const _getTrack = async (token, trackEndpoint) => {

      const result = await fetch(`${trackEndpoint}`, {
          method: 'GET',
          headers: { 'Authorization' : 'Bearer' + token}
      });

      const data = await result.json();
      return data;
    }

    return {
      getToken() {
        return _getToken();
      },
      getGenres(token) {
        return _getGenres(token);
      },
      getPlaylistbyGenre(token, genreId) {
        return _getPlaylistByGenre(token, genreId);
      },
      getTracks(token, tracksEndPoint) {
        return _getTracks(token, tracksEndPoint);
      },
      getTrack(token, trackEndpoint) {
        return _getTrack(token, trackEndpoint);
      }
      }
    }
})();

// UI Module
const UIController = (function() {

  // object to hold references to html selectors
  const DOMElements = {
      selectGenre: '#select_genre',
      selectPlaylist: '#select_playlist',
      buttonSubmit: '#btn_submit',
      divSongDetail: '#song-detail',
      hfToken: '#hidden_token',
      divSonglist: '.song-list'
  }

  // public methods
  return {

    // method to get input fields
    inputField() {
      return {
      genre: document.querySelector(DOMElements.selectGenre),
      playlist: document.querySelector(DOMElements.selectPlaylist),
      songs: document.querySelector(DOMElements.divSonglist),
      submit: document.querySelector(DOMElements.buttonSubmit),
      songDetail: document.querySelector(DOMElements.divSongDetail)
  }
  },

    // need methods  to create select list option
    createGenre(text, value) {
      const html = `<option value="${value}">${text}</option>`;
      document.querySelector(DOMElements.selectGenre).insertAdjacentHTML(`beforeend`, html);
    },

    createPlaylist(text, value) {
      const html = `<option value="${value}">${text}</option>`;
      document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML(`beforeend`, html);
    },

    // need method to create a track list group item
    createTrack(id, name) {
      const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name}</a>`;
      document.querySelector(DOMElements.divSonglist).insertAdjacentHTML(`beforeend`, html);
    },

    // need method to create the song detail
    createSongDetail(img, title, artist) {
      const detailDiv = document.querySelector(DOMElements.divSongDetail);
      // any time user clicks a new song, we need to clear out the song detail div
      detailDiv.innerHTML = '';

      const html =
      `
      <div class="row col-sm-12 px-0">
         <img src="${img}" alt="">
      </div>
      <div class="row col-sm-12 px-0">
          <label for="Genre" class="form-label col-sm-12>${title}:</label>
      </div>
      <div class="row col-sm-12 px-0">
          <label for="artist" class="form-label col-sm-12>"By ${artist}:</label>
      </div>
      `;

      detailDiv.innerAdjacentHTML(`beforeend`, html)
    },

    resetTrackDetail() {
        this.inputField().songDetail.innerHTML = '';
    },

    resetTracks() {
        this.inputField().songs.innerHTML = '';
        this.inputField().songDetail.innerHTML = '';
    },

    resetPlaylist() {
        this.inputField().playlist.innerHTML = '';
        this.resetTracks();
     }
  }

})();

const APPController = (function(UICtrl, APICtrl) {

  // get input field object ref
  const DOMInputs = UICtrl.inputField();

  // get genres on page load
  const loadGenres = async () => {
    // get the token
    const token = await APICtrl.getToken();
    // store the token onto the page
    UICtrl.storeToken(token);
    // get the genres
    const genres = await APICtrl.getGenres(token);
    // populate our genres select element
    genres.forEach(element => UICtrl.createGenre(element.name, element.id));
  }

  //create genre change event listener
  DOMInputs.genre.addEventListener('change', async () => {

    //when user changes genres, we need to reset the subsequent fields
    UICtrl.resetPlaylist();
    //get the token, add method to store the token on the page so we don't have to keep hitting the api for the token
    const token = UICtrl.getStoredToken().token;
    //get the genre select field
    const genreSelect = UICtrl.InputField().genre;
    // get the selected genreId
    const genreId = genreSelect.options[genreSelect.selectedIndex].value;
    // get the playlist data from spotify based on the genre
    const playlist = await APICtrl.getPlaylistbyGenre(token, genreId);
    // load the playlist select field
    console.log(playlist)

  });

// create submit button click event listener
  DOMInputs.submit.addEventListener('click', async (e) => {
    // prevent page reset
    e.preventDefault();

  });


