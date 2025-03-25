from fastapi import APIRouter, HTTPException, Query
from api.utils import send_request

download_router = APIRouter()

@download_router.get("/")
async def spotify_to_mp3(url: str = Query(..., description="Spotify URL to convert to MP3")):
    try:
        # Step 1: Fetch track details
        get_track_url = f"https://api.fabdl.com/spotify/get?url={url}"
        track_data = send_request(get_track_url)

        if "result" not in track_data:
            raise HTTPException(status_code=500, detail="Invalid track data received.")

        # Extract track details
        result = track_data["result"]
        gid = result["gid"]
        track_id = result["id"]

        # Step 2: Convert track to MP3
        convert_url = f"https://api.fabdl.com/spotify/mp3-convert-task/{gid}/{track_id}"
        convert_data = send_request(convert_url)

        if "result" not in convert_data or "download_url" not in convert_data["result"]:
            raise HTTPException(status_code=500, detail="Failed to convert track to MP3.")

        # Prepare the response
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