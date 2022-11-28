import './App.css';
import qs from 'querystring'
import { useState } from 'react';

// https://javascript.plainenglish.io/how-to-include-spotify-authorization-in-your-react-app-577b63138fd7
function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const _baseUrl = 'https://api.spotify.com/v1';
  const makeUrl = path => `${_baseUrl}${path}`;
  const accessToken = 'xx'
  const makeHeaders = (headers = {}) => ({
    ...headers,
    Authorization: `Bearer ${accessToken}`
  });

  const searchSong = async () => {
    const querystring = qs.stringify({
      type: 'track,artist,album',
      q: searchTerm
    });

    const response = await fetch(makeUrl(`/search?${querystring}`), {
      headers: makeHeaders()
    });
    console.log(response);

    // return data.tracks.items
  }
  
  const client_id = 'XX'; // Your client id
  const client_secret = 'XX'; // Your secret
  const auth_endpoint = 'https://accounts.spotify.com/authorize'
  const redirect_uri = 'http://localhost:3000'

  const getRedirectUri = (clientID, scopes, redirectUri, showDialog) => {
    return (
      'https://accounts.spotify.com/authorize?response_type=token' +
      `&client_id=${clientID}` +
      `&scope=${scopes.join('%20')}` +
      `&redirect_uri=${redirectUri}` +
      '&show_dialog=' +
      Boolean(showDialog)
    )
  }
  
  const login = async () => {
    const redirectUri = getRedirectUri(
      client_id,
      [],
      redirect_uri,
      true
    )

    if (window.location !== window.parent.location) {
      const loginWindow = window.open(redirectUri)
      window.addEventListener('message', (event) => {
        console.log("==", event);
        if (event.data.type !== 'react-spotify-auth' || !event.data.accessToken) {
          return
        }

        loginWindow.close()
        // this.props.onAccessToken(event.data.accessToken)
      }, false)
    } else {
      window.location = redirectUri
    }
  }


  return (
    <div className="App">
      <header className="App-header">
        <input placeholder='Search for a song' value={searchTerm} onChange={e => setSearchTerm(e.target.value)}></input>
        <button onClick={searchSong}>Search</button>
        <button onClick={login}>Login</button>
      </header>
    </div>
  );
}

export default App;
