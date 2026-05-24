
from database import engine, sessionlocal 
from database_models import Base,Aicallmetrics
import pandas as pd

#df = pd.read_excel("Worksheet in EzMedTech - AI Agent Metrics Project.xlsx")
df = pd.read_csv("Worksheet in EzMedTech - AI Agent Metrics Project.csv") 
# Use this line if you have the data in CSV format instead of Excel

Base.metadata.create_all(bind=engine)


session = sessionlocal()
for index, row in df.iterrows():
    metric = Aicallmetrics(
        month_name=row['month_name'],
        clinic_name=row['clinic_name'],
        user_request=row['user_request']
    )
    session.add(metric) 

session.commit()
print("data inserted successfully")
session.close()


 

















