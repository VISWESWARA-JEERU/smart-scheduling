from sqlalchemy import  String,Integer, Column,Date,DateTime,JSON
from sqlalchemy.orm import Mapped, mapped_column, declarative_base
from typing import Optional
Base = declarative_base()

class Aicallmetrics(Base):

    __tablename__ = "ai_call_metrics"
    id = Column(Integer, primary_key=True, index=True)
    month_name: Mapped[Date] = mapped_column(Date)
    clinic_name: Mapped[str] = mapped_column(String)
    user_request: Mapped[str] = mapped_column(String)


class AicallmetricsCreate(Base):

    __tablename__ = "ai_call_metrics2"
    id = Column(Integer, primary_key=True, index=True)
    unique_id: Mapped[str] = mapped_column(String, unique=True)
    call_id: Mapped[int] = mapped_column(Integer)
    clinic_name: Mapped[str] = mapped_column(String)
    call_timestamp: Mapped[DateTime] = mapped_column(DateTime)
    primary_intent: Mapped[str] = mapped_column(String)
    secondary_intents: Mapped[dict] = mapped_column(JSON)
    workflow_events:Mapped[list[dict]] = mapped_column(JSON)
    workflow_summary:Mapped[dict] = mapped_column(JSON)
    completion_data:Mapped[dict] = mapped_column(JSON)
    detected_intents: Mapped[dict] = mapped_column(JSON)
    blocker_data: Mapped[dict] = mapped_column(JSON)
    final_output: Mapped[str] = mapped_column(String)
    created_at: Mapped[DateTime] = mapped_column(DateTime)
    transcript: Mapped[dict] = mapped_column(JSON)