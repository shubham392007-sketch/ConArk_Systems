"""
Database migration runner for ConArk Systems Supabase PostgreSQL.
"""
import psycopg2
import sys

def run_migrations():
    conn_str = "postgresql://postgres:Shubham%40392007@db.fgdlibcsnjsbuwddcklb.supabase.co:5432/postgres"
    print(f"Connecting to Supabase PostgreSQL...")
    conn = psycopg2.connect(conn_str)
    conn.autocommit = True
    cur = conn.cursor()

    migration_files = [
        "supabase/migrations/001_initial_schema.sql",
        "supabase/migrations/002_rls_policies.sql",
        "supabase/migrations/003_indexes.sql",
        "supabase/migrations/004_storage.sql"
    ]

    for mf in migration_files:
        print(f"--- Running: {mf} ---")
        with open(mf, "r", encoding="utf-8") as f:
            sql = f.read()
        cur.execute(sql)
        print(f"[OK] Applied {mf}")

    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name")
    tables = [row[0] for row in cur.fetchall()]
    print("\nVerified Public Tables in Supabase Database:")
    for t in tables:
        print(f"  - {t}")

    cur.close()
    conn.close()
    print("\nAll database migrations executed successfully!")

if __name__ == "__main__":
    run_migrations()
