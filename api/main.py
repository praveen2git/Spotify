from fastapi import FastAPI
from api.search import search_router
from api.download import download_router
from api.dl import dl_router

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI(
    title="Spotify Downloader API",
    description="Search Spotify tracks, get details, and download MP3s using the fabdl API.",
    version="1.0.0"
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include routers
app.include_router(search_router, prefix="/search", tags=["Search"])
app.include_router(download_router, prefix="/download", tags=["Download"])
app.include_router(dl_router, prefix="/dl", tags=["Song Name to Download"])

@app.get("/", tags=["Root"])
async def root():
    return FileResponse('static/index.html')

