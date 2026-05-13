from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conn = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    database=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    port=os.getenv("DB_PORT")
)

# @app.get("/api/metrics")
# def get_metrics():

#     cursor = conn.cursor()

#     cursor.execute("""
#         SELECT month_name, clinic_name, user_request
#         FROM ai_call_metrics
#     """)

#     rows = cursor.fetchall()

#     result = []

#     for row in rows:
#         result.append({
#             "month_name": row[0],
#             "clinic_name": row[1],
#             "user_request": row[2]
#         })
@app.get("/api/metrics")
def get_metrics():

    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
            month_name,
            COUNT(user_request) AS request_count
        FROM ai_call_metrics
        GROUP BY month_name
        ORDER BY month_name
    """)

    rows = cursor.fetchall()

    result = []

    for row in rows:

        result.append({
            "month_name": row[0],
            "request_count": row[1]
        })

    

    cursor.close()

    return result