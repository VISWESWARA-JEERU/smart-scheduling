
from database import engine, sessionlocal 
from database_models import AicallmetricsCreate, Base,Aicallmetrics
import pandas as pd
import json

#df = pd.read_excel("Worksheet in EzMedTech - AI Agent Metrics Project.xlsx")
df = pd.read_csv("data-1780581604932.csv") 
# Use this line if you have the data in CSV format instead of Excel

Base.metadata.create_all(bind=engine)


session = sessionlocal()
for index,row in df.iterrows():
    metric = AicallmetricsCreate(
        unique_id=row['unique_id'],
        call_id=row['call_id'],
        clinic_name=row['clinic_name'],
        call_timestamp=row['call_timestamp'],
        primary_intent=row['primary_intent'],
        secondary_intents=json.loads(row['secondary_intents']),
        workflow_events=json.loads(row['workflow_events']),
        workflow_summary=json.loads(row['workflow_summary']),
        completion_data=json.loads(row['completion_data']),
        detected_intents=json.loads(row['detected_intents']),
        blocker_data=json.loads(row['blocker_data']),
        final_output=row['final_output'],
        created_at=row['created_at'],
        transcript=json.loads(row['transcript'])
    )
    session.add(metric)

# for index, row in df.iterrows():
#     metric = Aicallmetrics(
#         month_name=row['month_name'],
#         clinic_name=row['clinic_name'],
#         user_request=row['user_request']
#     )
#     session.add(metric) 

session.commit()
print("data inserted successfully")
session.close()


 

















