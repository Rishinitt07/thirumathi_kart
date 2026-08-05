#!/usr/bin/env python3
import os
import sys

def run_command(cmd):
    print("Executing: {}".format(cmd))
    status = os.system(cmd)
    if status != 0:
        print("Command failed with status {}".format(status))

print("--- Deleting Users Details ---")

commands = [
    # Buyer DB
    'PGPASSWORD=dharun123 psql -U postgres -d buyerdb -c "TRUNCATE TABLE users RESTART IDENTITY CASCADE;"',
    # Delivery DB 
    'PGPASSWORD=dharun123 psql -U postgres -d deliverydb -c "TRUNCATE TABLE users RESTART IDENTITY CASCADE;"',
    # Seller DB (mydb)
    'PGPASSWORD=dharun123 psql -U postgres -d mydb -c "TRUNCATE TABLE users RESTART IDENTITY CASCADE;"'
]

for cmd in commands:
    run_command(cmd)

print("Users deleted successfully.")
