
from fastapi import FastAPI,Depends,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import sessionlocal ,engine
import  database_models 
from  database_models import Base, Aicallmetrics
from sqlalchemy import select,func,desc,extract
from datetime import datetime

app = FastAPI()

database_models.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():    
    return {"message": "Welcome to the AI Call Metrics API!"}

def get_db():
    db = sessionlocal()
    try:
        yield db
    finally:
        db.close() 


# @app.get("/")
# def read_root(db= sessionlocal()):    
#     return {"message": "Welcome to the AI Call Metrics API!"}

@app.get("/api/metrics")
def get_metrics( db= Depends(get_db)):
   
    #metrics = db.query(database_models.Aicallmetrics).all()
    stmt = select(Aicallmetrics)
    metrics = db.scalars(stmt).all()
    result = []
    
   
    for metric in metrics:
        short_month = metric.month_name.strftime("%b")
        result.append({
             "id": metric.id,
            "month_name": short_month,
            "clinic_name": metric.clinic_name,
            "user_request": metric.user_request
        })   
    return result


@app.get("/api/monthly-requests")
def monthly_requests(db= Depends(get_db)):
      stmt = (select(Aicallmetrics.month_name,
            func.count(Aicallmetrics.user_request).label('request_count'))
            .group_by(Aicallmetrics.month_name)
            .order_by(Aicallmetrics.month_name))
      rows = db.execute(stmt).mappings().all()
      results =[]
      for row in rows:
            short_month = row.month_name.strftime("%b")
            results.append({
                'month_name':short_month,
                'request_count':row.request_count
            })
    
      return results
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

@app.get("/api/clinic-requests")
def clinic_requests( db = Depends(get_db)):
        
        stmt = (select(Aicallmetrics.clinic_name,
               (func.count(Aicallmetrics.user_request).label("total_requests")))
               .group_by(Aicallmetrics.clinic_name)
               .order_by(desc('total_requests')))
        rows = db.execute(stmt).mappings().all()
        

        results =[]
        for row in rows:
             results.append({
                  "clinic_name": row.clinic_name,
                  "total_requests":row.total_requests
             })    
        return results
    

@app.get("/api/request-types")
def request_types(db = Depends(get_db)):
      
      stmt = select(Aicallmetrics.user_request,
             func.count().label('total')).group_by(Aicallmetrics.user_request)
      request_types_data = db.execute(stmt).mappings().all()
      results = []
      for row in request_types_data:
           results.append({
                "user_request" : row["user_request"],
                "total":row["total"]
           })
      return results    


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







@app.get("/api/filter/month/{month}")
def filter_by_month(month:str,db=Depends(get_db)):
        try:
             month_number = datetime.strptime(month.title(),"%b").month
             
        except ValueError:
             raise HTTPException(status=404,detail = "invalid month use 'jan','feb,'mar'...")

        stmt = (select(Aicallmetrics.month_name,Aicallmetrics.clinic_name,Aicallmetrics.user_request)
                .where(extract('month',Aicallmetrics.month_name)== month_number))
        
        rows = db.execute(stmt).mappings().all()
        results=[]
        for row in rows:
         
            short_month = row.month_name.strftime("%b")
            results.append({
                  "month_name": short_month,
                  "clinic_name": row.clinic_name,
                  "user_request": row.user_request
            })

        return results
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

@app.get("/api/filter/clinic/{clinic}")
def filter_by_clinic(clinic: str,db=Depends(get_db)):   
        stmt = (select(Aicallmetrics.month_name,Aicallmetrics.clinic_name,Aicallmetrics.user_request)
             .where(Aicallmetrics.clinic_name == clinic))   
        rows = db.execute(stmt).mappings().all()
        results = []
        for row in rows:
            short_month = row.month_name.strftime("%b")
            results.append({
                  "month_name": short_month,
                  "clinic_name": row.clinic_name,
                  "user_request": row.user_request
            })
        return results



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

@app.get("/api/kpi")
def kpi_metrics(db=Depends(get_db)):

    stmt1 = select(func.count(Aicallmetrics.clinic_name.distinct()))
    total_clinics_count = db.scalar(stmt1)
   
    stmt2 = select(func.count()).select_from(Aicallmetrics)
    total_requests_count= db.scalar(stmt2)
#     cursor.execute("""
#         SELECT COUNT(*) FROM ai_call_metrics
#     """)

#     

#     cursor.execute("""
#         SELECT COUNT(DISTINCT clinic_name)
#         FROM ai_call_metrics
#     """)

#     total_clinics = cursor.fetchone()[0]

#     cursor.close()

    return {
        "total_requests": total_requests_count,
        "total_clinics": total_clinics_count
    }
