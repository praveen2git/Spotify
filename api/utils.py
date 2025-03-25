import requests
import base64

CLIENT_ID = "59f92a33627045c3a3db48a2a43c521c"
CLIENT_SECRET = "3e7a9c2558ab45248ea79afcaac40715"

def get_access_token():
    """Fetch Spotify API access token."""
    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": "Basic " + base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()
    }
    data = {"grant_type": "client_credentials"}

    response = requests.post(url, headers=headers, data=data)
    if response.status_code == 200:
        return response.json()["access_token"]
    else:
        raise Exception("Failed to get access token.")

def search_spotify(query, access_token, limit=5):
    """Search Spotify for a track."""
    url = "https://api.spotify.com/v1/search"
    headers = {"Authorization": f"Bearer {access_token}"}
    params = {"q": query, "type": "track", "limit": limit}

    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        tracks = response.json()["tracks"]["items"]
        if not tracks:
            return None
        return [
            {
                "name": track["name"],
                "artists": [artist["name"] for artist in track["artists"]],
                "album": track["album"]["name"],
                "spotify_url": track["external_urls"]["spotify"],
                "image": track["album"]["images"][0]["url"] if track["album"]["images"] else None
            }
            for track in tracks
        ]
    else:
        raise Exception("Failed to search Spotify.")

def send_request(url):
    """Send a GET request with a User-Agent header."""
    headers = {"User-Agent": "okhttp/4.9.0"}
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()