from pydantic import BaseModel

class ai_call_mertics(BaseModel):
    
    month_name:str
    clinic_name:str
    user_request:str
