import os
import subprocess
import sys

# Define databases and their setup queries
DATABASES = {
    "mydb": """
        CREATE TABLE IF NOT EXISTS public.products (
            id SERIAL PRIMARY KEY,
            name text NOT NULL,
            description text,
            category text,
            subcategory text,
            quantity integer DEFAULT 0,
            unit text,
            price numeric(10,2) DEFAULT 0,
            image1 bytea,
            image2 bytea,
            image3 bytea,
            image4 bytea,
            in_stock boolean DEFAULT true,
            mobile text,
            created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS public.users (
            mobile text PRIMARY KEY,
            name text NOT NULL,
            email text UNIQUE,
            password text NOT NULL,
            state text,
            country text,
            pincode text,
            profile_image bytea,
            created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
            first_name text,
            last_name text,
            gender text,
            store_name text,
            address_line_1 text,
            address_line_2 text,
            area text,
            landmark text,
            city text,
            about_store text,
            latitude numeric(10,6) DEFAULT 10.8745,
            longitude numeric(10,6) DEFAULT 78.7066
        );
    """,
    "buyerdb": """
        CREATE TABLE IF NOT EXISTS public.orders (
            id SERIAL PRIMARY KEY,
            username text,
            items jsonb,
            date timestamp without time zone,
            phone text,
            address text,
            city text,
            state text,
            pincode text,
            payment_method text,
            status text DEFAULT 'Processing',
            total numeric,
            latitude numeric,
            longitude numeric,
            seller_latitude numeric,
            seller_longitude numeric,
            delivery_fee numeric(10,2) DEFAULT 32,
            delivery_charge numeric DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS public.users (
            id SERIAL PRIMARY KEY,
            name text,
            username text UNIQUE,
            password text,
            first_name text,
            last_name text,
            gender text,
            email text,
            mobile text,
            feedback text,
            created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
            cart jsonb DEFAULT '[]'::jsonb,
            wishlist jsonb DEFAULT '[]'::jsonb,
            addresses jsonb DEFAULT '[]'::jsonb
        );
    """,
    "deliverydb": """
        CREATE TABLE IF NOT EXISTS public.users (
            username text PRIMARY KEY,
            name text NOT NULL,
            email text UNIQUE NOT NULL,
            phone text,
            password_hash text NOT NULL,
            created_at timestamp without time zone DEFAULT now(),
            updated_at timestamp without time zone DEFAULT now()
        );
        CREATE TABLE IF NOT EXISTS public.delivery_orders (
            id SERIAL PRIMARY KEY,
            order_id integer NOT NULL,
            delivery_user text NOT NULL REFERENCES public.users(username),
            status text NOT NULL CHECK (status IN ('assigned', 'in_progress', 'completed')),
            assigned_at timestamp without time zone DEFAULT now(),
            updated_at timestamp without time zone DEFAULT now(),
            drop_address text NOT NULL,
            drop_pincode text NOT NULL,
            pickup_address text NOT NULL,
            pickup_pincode text NOT NULL
        );
    """
}

def run_command(command, check=False):
    """Run a shell command and return its output."""
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    if check and result.returncode != 0:
        print(f"Error executing command: {command}")
        print(result.stderr)
        sys.exit(1)
    return result.stdout.strip(), result.returncode

def check_db_exists(db_name):
    """Check if a PostgreSQL database exists."""
    query = f"SELECT 1 FROM pg_database WHERE datname = '{db_name}'"
    cmd = f'psql -U postgres -tc "{query}"'
    out, code = run_command(cmd)
    return out == "1"

def create_db(db_name):
    """Create a new PostgreSQL database."""
    print(f"[*] Creating database '{db_name}'...")
    run_command(f'createdb -U postgres {db_name}', check=True)

def setup_schema(db_name, sql_script):
    """Run SQL script to create tables in a database."""
    print(f"[*] Setting up tables for '{db_name}'...")
    # Clean and execute via psql standard input to avoid quote escaping issues
    cmd = f'psql -U postgres -d {db_name} -c "{sql_script}"'
    run_command(cmd, check=True)

def get_db_tables(db_name):
    """Get list of tables for a database."""
    cmd = f'psql -U postgres -d {db_name} -c "\\dt"'
    out, code = run_command(cmd)
    return out

def main():
    print("========================================")
    print(" PostgreSQL Database Setup Automation ")
    print("========================================")
    
    all_setup = True
    
    for db_name, sql_script in DATABASES.items():
        if check_db_exists(db_name):
            print(f"[+] Database '{db_name}' already exists.")
        else:
            all_setup = False
            create_db(db_name)
            
        # Execute the schema setup (using IF NOT EXISTS so it's safe to re-run)
        setup_schema(db_name, sql_script)
        
    print("\n========================================")
    if all_setup:
        print("✅ Database already setuped!")
    else:
        print("✅ Database setup completed successfully!")
    print("========================================\n")
    
    print("--- Database Schema Details ---\n")
    for db_name in DATABASES.keys():
        print(f"Database: {db_name}")
        tables = get_db_tables(db_name)
        if tables:
            print(tables)
        else:
            print("No tables found.\n")

if __name__ == "__main__":
    main()
