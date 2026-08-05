#!/usr/bin/env python3
import os
import sys

def run_command(cmd):
    print("Executing: {}".format(cmd))
    status = os.system(cmd)
    if status != 0:
        print("Command failed with status {}".format(status))

print("--- Deleting Orders Details ---")

commands = [
    # Buyer DB
    'PGPASSWORD=dharun123 psql -U postgres -d buyerdb -c "TRUNCATE TABLE orders RESTART IDENTITY CASCADE;"',
    # Delivery DB 
    'PGPASSWORD=dharun123 psql -U postgres -d deliverydb -c "TRUNCATE TABLE delivery_orders RESTART IDENTITY CASCADE;"'
]

# Note: mydb (sellerdb) does not contain an orders table, 
# it manages its orders via buyerdb / sync mechanisms as identified in the schema.

for cmd in commands:
    run_command(cmd)

print("Orders deleted successfully.")
