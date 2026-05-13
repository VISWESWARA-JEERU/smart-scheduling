import os
from pathlib import Path

import pandas as pd
import psycopg2
from dotenv import load_dotenv   
load_dotenv()
password = os.getenv("DB_PASSWORD")
df = pd.read_excel("Worksheet in EzMedTech - AI Agent Metrics Project.xlsx",engine="openpyxl")

conn = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    database=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    port=os.getenv("DB_PORT")
)

cursor = conn.cursor()

for index, row in df.iterrows():

    cursor.execute("""
        INSERT INTO ai_call_metrics (
            month_name,
            clinic_name,
            user_request
        )
        VALUES (%s,%s,%s)
    """, (
        row['month_name'],
        row['clinic_name'], 
        row['user_request']
    ))

conn.commit()

print("Data inserted successfully!")

cursor.close()
conn.close()












