from fastapi import FastAPI
from api.search import search_router
from api.download import download_router
from api.dl import dl_router

app = FastAPI(
    title="Spotify Downloader API",
    description="Search Spotify tracks, get details, and download MP3s using the fabdl API.",
    version="1.0.0"
)

# Include routers
app.include_router(search_router, prefix="/search", tags=["Search"])
app.include_router(download_router, prefix="/download", tags=["Download"])
app.include_router(dl_router, prefix="/dl", tags=["Song Name to Download"])

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to the Spotify Downloader API!",
        "endpoints": {
            "/search/?q=": "Search for Spotify tracks by name.",
            "/download/?url=": "Get the direct download link for a Spotify track URL.",
            "/dl/?name=": "Search for a song by name and provide the direct download link.",
        },
        "Dev": "https://t.me/Itzzmeleo"
    }
