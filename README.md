
# 🎵 Spotify Downloader API

![API Status](https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Hosted_on-Vercel-black?style=for-the-badge&logo=vercel)
![FastAPI](https://img.shields.io/badge/Built_with-FastAPI-blue?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Language-Python-yellow?style=for-the-badge&logo=python)
![Requests](https://img.shields.io/badge/Library-Requests-orange?style=for-the-badge)
![Swagger](https://img.shields.io/badge/Docs-Swagger-green?style=for-the-badge&logo=swagger)
![Spotify](https://img.shields.io/badge/Powered_by-Spotify_API-lightgreen?style=for-the-badge&logo=spotify)

---

## 🎯 **Overview**

The **Spotify Downloader API** provides an easy way to:
- 🔍 **Search Spotify Tracks**: Retrieve detailed metadata including song name, album, and artists.
- 🎧 **Convert Spotify Tracks to MP3**: Obtain MP3 download links for any Spotify track URL.
- 🎼 **Search & Download in One Go**: Enter a song name, and get both metadata and an MP3 download link in a single request.

This API is hosted on **Vercel** and built with **FastAPI** for blazing-fast performance.

---

## 🌐 **Live Demo**
Access the API here: [leo-spotify.vercel.app](https://leo-spotify.vercel.app/)

---

## 🚀 **Features**

- **Lightning-Fast Search**: Quickly search for tracks with Spotify's official API.
- **MP3 Conversion**: Seamlessly convert tracks to MP3 via the FabDL API.
- **Comprehensive Metadata**: Get song details, including album cover, artists, and duration.
- **Swagger UI**: Interactive API documentation available.
- **Vercel Hosting**: Scalable and serverless deployment.

---

## 📖 **API Endpoints**

### 🔍 **1. Search for Tracks**
**`GET /search/?q=<song_name>&limit=<max_results>`**

**Description**: Search for Spotify tracks by name.  
**Query Parameters**:
- `q` (required): The name of the song to search for.
- `limit` (optional): Maximum number of results to return (default: 5).

**Example Request**:
```bash
GET https://leo-spotify.vercel.app/search/?q=Shape of You&limit=3
```

**Example Response**:
```json
{
  "tracks": [
    {
      "name": "Shape of You",
      "artists": ["Ed Sheeran"],
      "album": "÷ (Deluxe)",
      "spotify_url": "https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3",
      "image": "https://i.scdn.co/image/ab67616d0000b273f4fda1e4d5d5fdb8ef4b6ee6"
    },
    {
      "name": "Shape of You (Acoustic)",
      "artists": ["Ed Sheeran"],
      "album": "Shape of You (Acoustic)",
      "spotify_url": "https://open.spotify.com/track/xyz",
      "image": "https://i.scdn.co/image/ab67616d0000b273abc"
    }
  ],
  "Dev": "https://t.me/Itzzmeleo"
}
```

---

### 🎧 **2. Download by Spotify URL**
**`GET /download/?url=<spotify_url>`**

**Description**: Convert a Spotify track URL to an MP3 download link.  
**Query Parameters**:
- `url` (required): The Spotify track URL.

**Example Request**:
```bash
GET https://leo-spotify.vercel.app/download/?url=https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3
```

**Example Response**:
```json
{
  "id": "7qiZfU4dY1lWllzX7mPBI3",
  "type": "track",
  "name": "Shape of You",
  "image": "https://i.scdn.co/image/ab67616d0000b273f4fda1e4d5d5fdb8ef4b6ee6",
  "artists": ["Ed Sheeran"],
  "duration": "3:53",
  "download_url": "https://api.fabdl.com/path-to-download.mp3",
  "Dev": "https://t.me/Itzzmeleo"
}
```

---

### 🎼 **3. Search and Download by Name**
**`GET /dl/?name=<song_name>`**

**Description**: Search for a song by name and get its MP3 download link.  
**Query Parameters**:
- `name` (required): The name of the song to search and download.

**Example Request**:
```bash
GET https://leo-spotify.vercel.app/dl/?name=Shape of You
```

**Example Response**:
```json
{
  "id": "7qiZfU4dY1lWllzX7mPBI3",
  "type": "track",
  "name": "Shape of You",
  "image": "https://i.scdn.co/image/ab67616d0000b273f4fda1e4d5d5fdb8ef4b6ee6",
  "artists": ["Ed Sheeran"],
  "duration": "3:53",
  "download_url": "https://api.fabdl.com/path-to-download.mp3",
  "Dev": "https://t.me/Itzzmeleo"
}
```

---

## 🛠️ **Installation**

### Prerequisites
- Python 3.9+
- FastAPI
- Spotify Developer Credentials

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/praveen2git/Spotify.git
   cd leo-spotify
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Application**:
   ```bash
   uvicorn api.main:app --reload
   ```

4. **Access the API**:
   Open `http://127.0.0.1:8000` in your browser.

---

## 🚀 **Deployment**

This API is pre-configured for deployment on **Vercel**.

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the Project:
   ```bash
   vercel
   ```

---

## 👨‍💻 **Author**

[![Leo](https://img.shields.io/badge/Telegram-Leo-blue?style=for-the-badge&logo=telegram)](https://t.me/Itzzmeleo)

---

## 📜 **License**

This project is licensed under the **MIT License**.

---

## 🌟 **Acknowledgments**
- **Spotify API** for track metadata and search.
- **FabDL API** for MP3 conversion and download.
