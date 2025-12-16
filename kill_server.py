import os
import subprocess
import re

def kill_port(port):
    try:
        # Find PID
        cmd = f"netstat -ano | findstr :{port}"
        output = subprocess.check_output(cmd, shell=True).decode()
        print(f"Netstat output:\n{output}")
        
        pids = set()
        for line in output.splitlines():
            parts = line.split()
            if parts and f":{port}" in parts[1]:
                pids.add(parts[-1])
        
        if not pids:
            print(f"No process found on port {port}")
            return

        for pid in pids:
            if pid == "0": continue
            print(f"Killing PID {pid}")
            os.system(f"taskkill /F /PID {pid}")
            
    except subprocess.CalledProcessError:
        print(f"No process found on port {port}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    kill_port(8000)
