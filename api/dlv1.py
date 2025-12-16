from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
import requests
import urllib.parse

app = FastAPI()

# Function to send HTTP request with User-Agent header
def send_request(url):
    headers = {"User-Agent": "okhttp/4.9.0"}
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

@app.get("/")
async def spotify_to_mp3(url: str = Query(..., description="Spotify URL to convert to MP3")):
    try:
        # Step 1: Fetch track details
        get_track_url = f"https://api.fabdl.com/spotify/get?url={urllib.parse.quote(url)}"
        track_data = send_request(get_track_url)

        if "result" not in track_data:
            raise HTTPException(status_code=500, detail="Invalid track data received.")

        # Extract track details
        result = track_data["result"]
        track_id = result["id"]
        track_type = result["type"]
        name = result["name"]
        image = result["image"]
        artists = result["artists"]
        duration_ms = result["duration_ms"]
        gid = result["gid"]

        # Convert duration to minutes and seconds
        duration_minutes = duration_ms // 60000
        duration_seconds = (duration_ms % 60000) // 1000
        duration_formatted = f"{duration_minutes}:{duration_seconds:02}"

        # Step 2: Convert track to MP3
        convert_url = f"https://api.fabdl.com/spotify/mp3-convert-task/{gid}/{track_id}"
        convert_data = send_request(convert_url)

        if "result" not in convert_data or "download_url" not in convert_data["result"]:
            raise HTTPException(status_code=500, detail="Invalid conversion data received.")

        # Extract download URL
        download_url = f"https://api.fabdl.com{convert_data['result']['download_url']}"

        # Output JSON response
        response = {
            "id": track_id,
            "type": track_type,
            "name": name,
            "image": image,
            "artists": artists,
            "duration": duration_formatted,
            "download_url": download_url,
            "Dev": "pikachufrombd.t.me"
        }

        return JSONResponse(content=response)

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"HTTP Request failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))