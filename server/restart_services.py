#!/usr/bin/env python3
import os
import subprocess
import time
import sys

def run_command(cmd):
    return os.system(cmd)

print("Stopping Seller and Buyer Backends...")
# Find and kill processes listening on ports 8080 (seller) and 8081 (buyer)
run_command("lsof -ti :8080 | xargs kill -9 2>/dev/null")
run_command("lsof -ti :8081 | xargs kill -9 2>/dev/null")

print("Stopping Seller and Buyer Frontends...")
# Find and kill node/npm processes running the frontend
run_command("pkill -f 'npm run dev' 2>/dev/null")
run_command("pkill -f 'vite' 2>/dev/null")

print("Waiting for processes to terminate...")
time.sleep(2)

base_dir = "/Users/pheonix/Documents/Internship/thirumathi_kart"
server_dir = os.path.join(base_dir, "server")

seller_backend_dir = os.path.join(server_dir, "cmd", "seller")
buyer_backend_dir = os.path.join(server_dir, "cmd", "buyer")
seller_frontend_dir = os.path.join(base_dir, "tkart_seller")
buyer_frontend_dir = os.path.join(base_dir, "tkart_buyer")

def start_background_process(cmd, cwd, log_filename):
    print(f"Starting: '{cmd}' in {cwd}")
    log_path = os.path.join(server_dir, log_filename)
    with open(log_path, "a") as log_file:
        log_file.write(f"\n--- Starting {cmd} at {time.ctime()} ---\n")
        subprocess.Popen(
            cmd,
            shell=True,
            cwd=cwd,
            stdout=log_file,
            stderr=subprocess.STDOUT,
            start_new_session=True
        )

print("Starting Seller and Buyer Backends...")
start_background_process("go run main.go", seller_backend_dir, "seller_backend.log")
start_background_process("go run main.go", buyer_backend_dir, "buyer_backend.log")

print("Starting Seller and Buyer Frontends...")
start_background_process("npm run dev", seller_frontend_dir, "seller_frontend.log")
start_background_process("npm run dev", buyer_frontend_dir, "buyer_frontend.log")

print("All services have been restarted successfully!")
print(f"Check the log files in {server_dir} for output.")
