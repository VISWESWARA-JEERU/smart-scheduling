#from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
#import psycopg2


from database import sessionlocal ,engine
#from dotenv import load_dotenv
import  database_models 
from  database_models import Base,ai_call_metrics
#load_dotenv()

app = FastAPI()

database_models.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# conn = psycopg2.connect(
#     host=os.getenv("DB_HOST"),
#     database=os.getenv("DB_NAME"),
#     user=os.getenv("DB_USER"),
#     password=os.getenv("DB_PASSWORD"),
#     port=os.getenv("DB_PORT")
# )
#conn = sessionlocal()
def get_db():
    db = sessionlocal()
    try:
        yield db
    finally:
        db.close() 

@app.get("/api/metrics")
def get_metrics():
    db:sessionlocal= sessionlocal()
    metrics = db.query(database_models.ai_call_metrics).all()

    result = []

    for metric in metrics:
        result.append({
            "month_name": metric.month_name,
            "clinic_name": metric.clinic_name,
            "user_request": metric.user_request
        })   
    return result

# @app.get("/api/metrics")
# def get_metrics():

#     cursor = db.cursor()

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
# # @app.get("/api/metrics")
# # def get_metrics():

# #     cursor = conn.cursor()

# #     cursor.execute("""
# #         SELECT 
# #             month_name,
# #             COUNT(user_request) AS request_count
# #         FROM ai_call_metrics
# #         GROUP BY month_name
# #         ORDER BY month_name
# #     """)

# #     rows = cursor.fetchall()

# #     result = []

# #     for row in rows:

# #         result.append({
# #             "month_name": row[0],
# #             "request_count": row[1]
# #         })

#     cursor.close()

#     return result



# @app.get("/api/monthly-requests")
# def monthly_requests():

#     cursor = conn.cursor()

#     cursor.execute("""
#         SELECT 
#             month_name,
#             COUNT(user_request) AS request_count
#         FROM ai_call_metrics
#         GROUP BY month_name
#         ORDER BY month_name
#     """)

#     rows = cursor.fetchall()

#     result = []

#     for row in rows:

#         result.append({
#             "month_name": row[0],
#             "request_count": row[1]
#         })

#     cursor.close()

#     return result

# @app.get("/api/clinic-requests")
# def clinic_requests():

#     cursor = conn.cursor()

#     cursor.execute("""
#         SELECT
#             clinic_name,
#             COUNT(user_request) AS total_requests
#         FROM ai_call_metrics
#         GROUP BY clinic_name
#         ORDER BY total_requests DESC
#     """)

#     rows = cursor.fetchall()

#     result = []

#     for row in rows:

#         result.append({
#             "clinic_name": row[0],
#             "total_requests": row[1]
#         })

#     cursor.close()

#     return result

# @app.get("/api/request-types")
# def request_types():

#     cursor = conn.cursor()

#     cursor.execute("""
#         SELECT
#             user_request,
#             COUNT(*) as total
#         FROM ai_call_metrics
#         GROUP BY user_request
#     """)

#     rows = cursor.fetchall()

#     result = []

#     for row in rows:

#         result.append({
#             "user_request": row[0],
#             "total": row[1]
#         })

#     cursor.close()

#     return result







# # @app.get("/api/filter/month/{month}")
# # def filter_by_month(month: str):

# #     cursor = conn.cursor()

# #     cursor.execute("""
# #         SELECT
# #             month_name,
# #             clinic_name,
# #             user_request
# #         FROM ai_call_metrics
# #         WHERE month_name = %s
# #     """, (month,))

# #     rows = cursor.fetchall()

# #     result = []

# #     for row in rows:

# #         result.append({
# #             "month_name": row[0],
# #             "clinic_name": row[1],
# #             "user_request": row[2]
# #         })

# #     cursor.close()

# #     return result

# @app.get("/api/filter/clinic/{clinic}")
# def filter_by_clinic(clinic: str):

#     cursor = conn.cursor()

#     cursor.execute("""
#         SELECT
#             month_name,
#             clinic_name,
#             user_request
#         FROM ai_call_metrics
#         WHERE clinic_name = %s
#     """, (clinic,))

#     rows = cursor.fetchall()

#     result = []

#     for row in rows:

#         result.append({
#             "month_name": row[0],
#             "clinic_name": row[1],
#             "user_request": row[2]
#         })

#     cursor.close()

#     return result

# @app.get("/api/kpi")
# def kpi_metrics():

#     cursor = conn.cursor()

#     cursor.execute("""
#         SELECT COUNT(*) FROM ai_call_metrics
#     """)

#     total_requests = cursor.fetchone()[0]

#     cursor.execute("""
#         SELECT COUNT(DISTINCT clinic_name)
#         FROM ai_call_metrics
#     """)

#     total_clinics = cursor.fetchone()[0]

#     cursor.close()

#     return {
#         "total_requests": total_requests,
#         "total_clinics": total_clinics
#     }
