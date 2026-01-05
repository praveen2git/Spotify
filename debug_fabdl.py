import requests
import json

def send_request(url):
    headers = {"User-Agent": "okhttp/4.9.0"}
    response = requests.get(url, headers=headers)
    print(f"DEBUG: Status Code: {response.status_code}")
    try:
        data = response.json()
        # print(f"DEBUG: Response: {json.dumps(data, indent=2)}") 
        return data
    except Exception as e:
        print(f"DEBUG: Failed to parse JSON: {e}")
        return {}

def test_download():
    url = "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT" # Never Gonna Give You Up
    print(f"Testing URL: {url}")

    # Step 1
    get_track_url = f"https://api.fabdl.com/spotify/get?url={url}"
    print(f"Calling: {get_track_url}")
    track_data = send_request(get_track_url)
    
    if "result" not in track_data:
        print("ERROR: Invalid track data received.")
        print(track_data)
        return

    result = track_data["result"]
    gid = result["gid"]
    track_id = result["id"]
    print(f"GID: {gid}, Track ID: {track_id}")

    # Step 2
    convert_url = f"https://api.fabdl.com/spotify/mp3-convert-task/{gid}/{track_id}"
    print(f"Calling: {convert_url}")
    convert_data = send_request(convert_url)

    if "result" not in convert_data:
        print("ERROR: result not in convert_data")
        print(convert_data)
        return
    
    if "download_url" not in convert_data["result"]:
        print("ERROR: download_url not in result")
        print(convert_data)
        return

    print("SUCCESS: Download URL found")
    print(convert_data["result"]["download_url"])

if __name__ == "__main__":
    test_download()
