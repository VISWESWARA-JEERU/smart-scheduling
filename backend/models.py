from pydantic import BaseModel
from datetime import date
class Aicallmetrics(BaseModel):
    
    month_name:date
    clinic_name:str
    user_request: str
