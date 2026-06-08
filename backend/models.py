from pydantic import BaseModel
from datetime import date,datetime,dict
from typing import Dict, Optional
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
    secondary_intents:dict | Dict[str, any]
    detected_intents:dict | Dict[str, any]
    workflow_events :list[Dict[str, any]]
    workflow_summary :dict[str,any]
    completion_data:dict[str,any]
    blocker_data :dict | Dict[str, any]
    final_output :str
    created_at: datetime | None = None
    transcript:dict| Dict[str, any]




     
