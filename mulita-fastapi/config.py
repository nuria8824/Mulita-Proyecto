import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")  # Service Role para escribir en Storage

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
