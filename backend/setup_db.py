"""
Simple script to create the database if it doesn't exist.
Run this before starting the FastAPI server.
"""
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def create_database():
    try:
        # Connect to PostgreSQL server
        conn = psycopg2.connect(
            dbname='postgres',
            user='postgres',
            password='root',
            host='localhost'
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute("SELECT 1 FROM pg_database WHERE datname='PairPrograming'")
        exists = cursor.fetchone()
        
        if not exists:
            cursor.execute('CREATE DATABASE "PairPrograming"')
            print("✅ Database 'PairPrograming' created successfully!")
        else:
            print("✅ Database 'PairPrograming' already exists!")
        
        cursor.close()
        conn.close()
        
    except psycopg2.Error as e:
        print(f"❌ Error: {e}")
        print("\n⚠️  Make sure PostgreSQL is running and credentials are correct!")
        print("   Default credentials: user=postgres, password=root")
        return False
    
    return True

if __name__ == "__main__":
    print("Creating PostgreSQL database...")
    create_database()
