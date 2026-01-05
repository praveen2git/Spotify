import requests
import json
import time

TRACK_URL = "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT" # Never Gonna Give You Up

INSTANCES = [
    "https://cobalt.clxxped.lol",
    "https://cobalt.meowing.de",
    "https://cobalt.canine.tools"
]

def test_cobalt_instance(base_url):
    print(f"\n--- Testing Cobalt Instance: {base_url} ---")
    
    # Try common endpoints for Cobalt v7/v10
    endpoints = ["/api/json", "/"]
    
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)"
    }
    body = {
        "url": TRACK_URL,
        "aFormat": "mp3",
        "isAudioOnly": True
    }

    for ep in endpoints:
        url = base_url + ep
        try:
            print(f"Trying {url}...")
            response = requests.post(url, headers=headers, json=body, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if "url" in data:
                    print(f"SUCCESS! Download URL: {data['url']}")
                    return True, url
                elif "audio" in data: # sometimes it returns 'audio'
                     print(f"SUCCESS! Download URL: {data['audio']}")
                     return True, url
                else:
                    print(f"Response (no url): {data}")
            else:
                print(f"Failed {response.status_code}: {response.text[:100]}")
        except Exception as e:
            print(f"Error connecting to {url}: {e}")
            
    return False, None

if __name__ == "__main__":
    working_instance = None
    for instance in INSTANCES:
        success, url = test_cobalt_instance(instance)
        if success:
            working_instance = instance
            break
            
    if working_instance:
        print(f"\nFOUND WORKING INSTANCE: {working_instance}")
    else:
        print("\nNO WORKING INSTANCES FOUND")
