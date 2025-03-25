from fastapi import APIRouter, HTTPException, Query
from api.utils import get_access_token, search_spotify

search_router = APIRouter()

@search_router.get("/")
async def search_song(q: str = Query(..., description="Song name to search on Spotify"), limit: int = 5):
    try:
        # Get Spotify Access Token
        access_token = get_access_token()

        # Search Spotify for the song
        results = search_spotify(q, access_token, limit)

        if not results:
            raise HTTPException(status_code=404, detail=f"No results found for '{q}'.")

        return {
            "tracks": results,
            "Dev": "https://t.me/Itzzmeleo"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))