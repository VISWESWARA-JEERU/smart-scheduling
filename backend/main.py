
from fastapi import FastAPI,Depends,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import sessionlocal ,engine
import  database_models 
from  database_models import  Aicallmetrics
from sqlalchemy import select,func,desc,extract
from datetime import datetime

app = FastAPI()

database_models.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
        "https://smart-scheduling-1zlwhqoo8-visweswara-jeeru-s-projects.vercel.app"],
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


# @app.get("/api/monthly-requests")
# def monthly_requests(db= Depends(get_db)):
#       stmt = (select(Aicallmetrics.month_name,
#             func.count(Aicallmetrics.user_request).label('request_count'))
#             .group_by(Aicallmetrics.month_name)
#             .order_by(Aicallmetrics.month_name))
#       rows = db.execute(stmt).mappings().all()
#       results =[]
#       for row in rows:
#             short_month = row.month_name.strftime("%b")
#             results.append({
#                 'month_name':short_month,
#                 'request_count':row.request_count
#             })
    
#       return results

@app.get("/api/monthly-requests")
def monthly_requests(year: int = None, db=Depends(get_db)):

    stmt = select(
        extract("month", Aicallmetrics.month_name).label("month"),
        extract("year", Aicallmetrics.month_name).label("year"),
        func.count(Aicallmetrics.user_request).label("request_count")
    )

    if year:
        stmt = stmt.where(extract("year", Aicallmetrics.month_name) == year)

    stmt = (
        stmt.group_by(
            extract("month", Aicallmetrics.month_name),
            extract("year", Aicallmetrics.month_name)
        )
        .order_by(extract("month", Aicallmetrics.month_name))
    )

    rows = db.execute(stmt).mappings().all()

    results = []

    for row in rows:
        month_name = datetime(
            int(row.year),
            int(row.month),
            1
        ).strftime("%b")

        results.append({
            "month": int(row.month),
            "year": int(row.year),
            "month_name": month_name,
            "request_count": row.request_count
        })

    return results




# @app.get("/api/clinic-requests")
# def clinic_requests( db = Depends(get_db)):
        
#         stmt = (select(Aicallmetrics.clinic_name,
#                (func.count(Aicallmetrics.user_request).label("total_requests")))
#                .group_by(Aicallmetrics.clinic_name)
#                .order_by(desc('total_requests')))
#         rows = db.execute(stmt).mappings().all()
        

#         results =[]
#         for row in rows:
#              results.append({
#                   "clinic_name": row.clinic_name,
#                   "total_requests":row.total_requests
#              })    
#         return results
@app.get("/api/clinic-requests")
def clinic_requests(
    month: int = None,
    year: int = None,
    db=Depends(get_db)
):

    stmt = select(
        Aicallmetrics.clinic_name,
        func.count(Aicallmetrics.user_request).label("total_requests")
    )

    if month:
        stmt = stmt.where(extract("month", Aicallmetrics.month_name) == month)

    if year:
        stmt = stmt.where(extract("year", Aicallmetrics.month_name) == year)

    stmt = (
        stmt.group_by(Aicallmetrics.clinic_name)
        .order_by(desc("total_requests"))
    )

    rows = db.execute(stmt).mappings().all()

    return [
        {
            "clinic_name": row.clinic_name,
            "total_requests": row.total_requests
        }
        for row in rows
    ]
    

# @app.get("/api/request-types")
# def request_types(db = Depends(get_db)):
      
#       stmt = select(Aicallmetrics.user_request,
#              func.count().label('total')).group_by(Aicallmetrics.user_request)
#       request_types_data = db.execute(stmt).mappings().all()
#       results = []
#       for row in request_types_data:
#            results.append({
#                 "user_request" : row["user_request"],
#                 "total":row["total"]
#            })
#       return results   
 
@app.get("/api/request-types")
def request_types(
    month: int = None,
    year: int = None,
    db=Depends(get_db)
):

    stmt = select(
        Aicallmetrics.user_request,
        func.count().label("total")
    )

    if month:
        stmt = stmt.where(extract("month", Aicallmetrics.month_name) == month)

    if year:
        stmt = stmt.where(extract("year", Aicallmetrics.month_name) == year)

    stmt = stmt.group_by(Aicallmetrics.user_request)

    rows = db.execute(stmt).mappings().all()

    return [
        {
            "user_request": row.user_request,
            "total": row.total
        }
        for row in rows
    ]


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
# @app.get("/api/kpi")
# def kpi_metrics(db=Depends(get_db)):

#     stmt1 = select(func.count(Aicallmetrics.clinic_name.distinct()))
#     total_clinics_count = db.scalar(stmt1)
   
#     stmt2 = select(func.count()).select_from(Aicallmetrics)
#     total_requests_count= db.scalar(stmt2)
#     return {
#         "total_requests": total_requests_count,
#         "total_clinics": total_clinics_count
#     }

@app.get("/api/kpi")
def kpi_metrics(
    month: int = None,
    year: int = None,
    db=Depends(get_db)
):

    stmt = select(Aicallmetrics)

    if month:
        stmt = stmt.where(extract("month", Aicallmetrics.month_name) == month)

    if year:
        stmt = stmt.where(extract("year", Aicallmetrics.month_name) == year)

    subquery = stmt.subquery()

    total_requests_count = db.scalar(
        select(func.count()).select_from(subquery)
    )

    total_clinics_count = db.scalar(
        select(func.count(func.distinct(subquery.c.clinic_name)))
    )

    return {
        "total_requests": total_requests_count,
        "total_clinics": total_clinics_count
    }


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




@app.get("/api/clinic-requests/month/{month}")
def clinic_requests_by_month(month:str,db=Depends(get_db)):     
        try:
             month_number = datetime.strptime(month.title(),"%b").month
             
        except ValueError:
             raise HTTPException(status=404,detail = "invalid month use 'jan','feb,'mar'...")

        stmt = (select(Aicallmetrics.clinic_name,
               func.count(Aicallmetrics.user_request).label("total_requests"))
               .where(extract('month',Aicallmetrics.month_name)== month_number)
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


# --------------------------------------------------------------------------------
#                             Report Generation Endpoints
# -----------------------------------------------------------------------------



@app.get("/api/reports")
def get_reports(
    clinic: str = None,
    month: str = None,
    request_type: str = None,
    db=Depends(get_db)
):

    stmt = select(
        Aicallmetrics.month_name,
        Aicallmetrics.clinic_name,
        Aicallmetrics.user_request
    )

    if clinic:
        stmt = stmt.where(
            Aicallmetrics.clinic_name == clinic
        )

    if month:
        stmt = stmt.where( func.date_format(Aicallmetrics.month_name,"%b") == month)

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