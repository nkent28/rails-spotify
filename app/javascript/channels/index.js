// Load all the channels within this directory and all subdirectories.
// Channel files must be named *_channel.js.

const channels = require.context('.', true, /_channel\.js$/)
channels.keys().forEach(channels)

const APIController = (function() {

  const clientId = '';
  const clientSecret = '';


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


})();


