import pandas as pd
import psycopg2
import openpyxl
df = pd.read_excel("ai_call_metrices.xlsx",engine="openpyxl")

conn = psycopg2.connect(
    host="localhost",
    database="smart_scheduling_db",
    user="postgres",
    password="1234",
    port="5432"
)

cursor = conn.cursor()

for index, row in df.iterrows():

    cursor.execute("""
        INSERT INTO ai_call_metrics (
            call_id,
            patient_name,
            doctor_name,
            department,
            call_status,
            call_duration,
            appointment_date,
            city,
            bill_amount
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """, (
        row['call_id'],
        row['patient_name'],
        row['doctor_name'],
        row['department'],
        row['call_status'],
        row['call_duration'],
        row['appointment_date'],
        row['city'],
        row['bill_amount']
    ))

conn.commit()

print("Data inserted successfully!")

cursor.close()
conn.close()












