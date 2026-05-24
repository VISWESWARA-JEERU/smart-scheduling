from sqlalchemy import  String,Integer, Column,Date
from sqlalchemy.orm import Mapped, mapped_column, declarative_base

Base = declarative_base()

class Aicallmetrics(Base):

    __tablename__ = "ai_call_metrics"
    id = Column(Integer, primary_key=True, index=True)
    month_name: Mapped[Date] = mapped_column(Date)
    clinic_name: Mapped[str] = mapped_column(String)
    user_request: Mapped[str] = mapped_column(String)

