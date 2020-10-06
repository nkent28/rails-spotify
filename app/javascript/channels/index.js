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
    } //CODE IS READY TO PUSH FOR TOMORROW, CHECK GITHUB
})();


