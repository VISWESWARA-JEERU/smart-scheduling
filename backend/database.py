from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os 
from dotenv import load_dotenv  
load_dotenv()

host=os.getenv("DB_HOST")
database=os.getenv("DB_NAME")
user=os.getenv("DB_USER")
password=os.getenv("DB_PASSWORD")
port=os.getenv("DB_PORT")

db_url = f"postgresql://{user}:{password}@{host}:{port}/{database}"
# #db_url = 'postgresql://postgres:1234@localhost:5432/ai_metrics_db'

#deployment url is set in the environment variable DATABASE_URL in vercel dashboard

# db_url = os.getenv("DATABASE_URL")

# if db_url is None:
#     raise ValueError("DATABASE_URL environment variable is not set")

engine = create_engine(db_url)

sessionlocal = sessionmaker(autocommit = False, autoflush=False,bind=engine)


