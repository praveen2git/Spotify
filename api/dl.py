from fastapi import APIRouter, HTTPException, Query
from api.utils import get_access_token, search_spotify, send_request

dl_router = APIRouter()

@dl_router.get("/")
async def song_to_download(name: str = Query(..., description="Song name to search and download")):
    try:
        # Get Spotify Access Token
        access_token = get_access_token()

        # Search for the song
        results = search_spotify(name, access_token, limit=1)

        if not results:
            raise HTTPException(status_code=404, detail=f"No results found for '{name}'.")

        # Get the first track's Spotify URL
        spotify_url = results[0]["spotify_url"]

        # Download the track
        get_track_url = f"https://api.fabdl.com/spotify/get?url={spotify_url}"
        track_data = send_request(get_track_url)

        if "result" not in track_data:
            raise HTTPException(status_code=500, detail="Invalid track data received.")

        # Convert to MP3
        result = track_data["result"]
        gid = result["gid"]
        track_id = result["id"]
        convert_url = f"https://api.fabdl.com/spotify/mp3-convert-task/{gid}/{track_id}"
        convert_data = send_request(convert_url)

        if "result" not in convert_data or "download_url" not in convert_data["result"]:
            raise HTTPException(status_code=500, detail="Failed to convert track to MP3.")

        # Return track details and download link
        response = {
            "id": result["id"],
            "type": result["type"],
            "name": result["name"],
            "image": result["image"],
            "artists": result["artists"],
            "duration": f"{result['duration_ms'] // 60000}:{(result['duration_ms'] % 60000) // 1000:02d}",
            "download_url": f"https://api.fabdl.com{convert_data['result']['download_url']}",
            "Dev": "https://t.me/Itzzmeleo"
        }
        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))