from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


db_url = 'postgresql://postgres:1234@localhost:5432/ai_metrics_db'
engine = create_engine(db_url)

sessionlocal = sessionmaker(autocommit = False, autoflush=False,bind=engine)

