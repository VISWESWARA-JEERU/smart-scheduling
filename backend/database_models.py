from sqlalchemy import Column, Integer,String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class ai_call_metrics(Base):

    __table__ = "ai_call_metrics"
    month_name = Column(String)
    clinic_name = Column(String)
    user_request = Column(String)

