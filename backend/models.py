from pydantic import BaseModel
from datetime import date,datetime,dict
from typing import Dict,List,Any
class Aicallmetrics(BaseModel):
    id: int | None = None
    month_name:date
    clinic_name:str
    user_request: str


class AicallmetricsCreate(BaseModel) :
    unique_id :str| None= None
    call_id :int 
    clinic_name:str
    call_timestamp : datetime
    primary_intent:str
    secondary_intents:dict | Dict[str, Any]
    detected_intents:dict | Dict[str, Any]
    workflow_events :List[Dict[str, Any]]
    workflow_summary :dict[str,Any]
    completion_data:dict[str,Any]
    blocker_data :dict | Dict[str, Any]
    final_output :str
    created_at: datetime | None = None
    transcript:dict| Dict[str, Any]
    class Config:
     from_attributes = True




     
