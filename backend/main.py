
from fastapi import FastAPI,Depends,Query
from fastapi.middleware.cors import CORSMiddleware
from database import sessionlocal ,engine
import  database_models 
from  database_models import  Aicallmetrics, AicallmetricsCreate
from sqlalchemy import select,func,desc,extract
from datetime import datetime,date
from typing import Optional
from sqlalchemy import select, func, extract, cast, Date
from collections import Counter, defaultdict
import calendar


app = FastAPI()

database_models.Base.metadata.create_all(bind=engine)

# http://localhost:5173",
#        "https://smart-scheduling-2ymx154p3-visweswara-jeeru-s-projects.vercel.app/
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


@app.get("/api/metrics_call")
def get_metrics( db= Depends(get_db)):
   
    #metrics = db.query(database_models.AicallmetricsCreate).all()
    stmt = select(AicallmetricsCreate.clinic_name,AicallmetricsCreate.call_timestamp)
    metrics = db.execute(stmt).all()
    result = []
    
    for metric in metrics:
        
        result.append({
            "clinic_name": metric.clinic_name,
            "month_name": metric.call_timestamp.strftime("%b %Y")
        })   
    return result


@app.get("/api/monthly-requests")
def monthly_requests(year: Optional[int] = None,db=Depends(get_db)):

    stmt = select(
        extract("month", AicallmetricsCreate.call_timestamp).label("month"),
        extract("year", AicallmetricsCreate.call_timestamp).label("year"),
        func.count(AicallmetricsCreate.final_output).label("request_count")
    )

    if year:
        stmt = stmt.where(extract("year", AicallmetricsCreate.call_timestamp) == year)
    
    

    stmt = (
        stmt.group_by(
            extract("month", AicallmetricsCreate.call_timestamp),
            extract("year", AicallmetricsCreate.call_timestamp)
        )
        .order_by(extract("month", AicallmetricsCreate.call_timestamp))
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


@app.get("/api/clinic-requests")
def clinic_requests(
    month: Optional[int] = None,
    year: Optional[int] = None,
    db=Depends(get_db)
):

    stmt = select(
        AicallmetricsCreate.clinic_name,
        func.count(AicallmetricsCreate.final_output).label("total_requests")
    )

    if month:
        stmt = stmt.where(extract("month", AicallmetricsCreate.call_timestamp) == month)

    if year:
        stmt = stmt.where(extract("year", AicallmetricsCreate.call_timestamp) == year)
    
    

    stmt = (
        stmt.group_by(AicallmetricsCreate.clinic_name)
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
      
 
@app.get("/api/request-types")
def request_types(
    month: Optional[int] = None,
    year: Optional[int] = None,
    clinic: str = None,
    db=Depends(get_db)
):

    stmt = select(
        AicallmetricsCreate.final_output,
        func.count().label("total")
    )

    if month:
        stmt = stmt.where(extract("month", AicallmetricsCreate.call_timestamp) == month)

    if year:
        stmt = stmt.where(extract("year", AicallmetricsCreate.call_timestamp) == year)
    if clinic:
        stmt = stmt.where(AicallmetricsCreate.clinic_name == clinic)

    stmt = stmt.group_by(AicallmetricsCreate.final_output)

    rows = db.execute(stmt).mappings().all()

    return [
        {
            "user_request": row.final_output,
            "total": row.total
        }
        for row in rows
    ]


@app.get("/api/kpi")
def kpi_metrics(
    month: Optional[int] = None,
    year: Optional[int] = None,
    clinic: Optional[str] = None,
    db=Depends(get_db)
):

    stmt = select(AicallmetricsCreate)

    if month:
        stmt = stmt.where(extract("month", AicallmetricsCreate.call_timestamp) == month)

    if year:
        stmt = stmt.where(extract("year", AicallmetricsCreate.call_timestamp) == year)
    if clinic:
        stmt = stmt.where(AicallmetricsCreate.clinic_name == clinic)

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

#------------------------------------------------------
#                 Analytics 
#------------------------------------------------------
#
#   ----------Total Request KPI card endpoint------
@app.get("/api/analytics/total-requests")
def total_requests_details(
    month: int = Query(...),
    year: int = Query(...),
    db = Depends(get_db)
):
    date_col = cast(AicallmetricsCreate.call_timestamp, Date)

    stmt = (
        select(
            date_col.label("date"),
            func.count(AicallmetricsCreate.id).label("requests")
        )
        .where(extract("month", AicallmetricsCreate.call_timestamp) == month)
        .where(extract("year", AicallmetricsCreate.call_timestamp) == year)
        .group_by(date_col)
        .order_by(date_col)
    )

    rows = db.execute(stmt).all()

    total_requests = sum(row.requests for row in rows)
    daily_average = round(total_requests / len(rows), 2) if rows else 0

    highest_day = max(rows, key=lambda row: row.requests, default=None)
    lowest_day = min(rows, key=lambda row: row.requests, default=None)

    chart_data = []
    daily_breakdown = []

    previous_requests = None

    for row in rows:
        change = 0 if previous_requests is None else row.requests - previous_requests

        if previous_requests is None or previous_requests == 0:
            percentage = 0
        else:
            percentage = round((change / previous_requests) * 100, 2)

        chart_data.append({
            "date": row.date.strftime("%b %d"),
            "requests": row.requests
        })

        daily_breakdown.append({
            "date": row.date.strftime("%B %d, %Y"),
            "requests": row.requests,
            "change": change,
            "percentage": percentage
        })

        previous_requests = row.requests

    return {
        "cards": {
            "total_requests": total_requests,
            "daily_average": daily_average,
            "highest_day": {
                "date": highest_day.date.strftime("%B %d, %Y") if highest_day else "No data",
                "requests": highest_day.requests if highest_day else 0
            },
            "lowest_day": {
                "date": lowest_day.date.strftime("%B %d, %Y") if lowest_day else "No data",
                "requests": lowest_day.requests if lowest_day else 0
            }
        },
        "chart": chart_data,
        "daily_breakdown": daily_breakdown
    }


@app.get("/api/analytics/appointment-confirmation")
def appointment_confirmation_details(
    month: int = Query(...),
    year: int = Query(...),
    db=Depends(get_db)
):
    date_col = cast(AicallmetricsCreate.call_timestamp, Date)

    appointment_outputs = [
    "Schedule Appointment / User Ended Early",
    "Schedule Appointment"
    ]

    stmt = (
    select(
        date_col.label("date"),
        func.count(AicallmetricsCreate.id).label("requests")
    )
    .where(extract("month", AicallmetricsCreate.call_timestamp) == month)
    .where(extract("year", AicallmetricsCreate.call_timestamp) == year)
    .where(
        AicallmetricsCreate.final_output.in_(appointment_outputs)
    )
    .group_by(date_col)
    .order_by(date_col))

    rows = db.execute(stmt).all()

    total_requests = sum(row.requests for row in rows)
    daily_average = round(total_requests / len(rows), 2) if rows else 0

    highest_day = max(rows, key=lambda row: row.requests, default=None)
    lowest_day = min(rows, key=lambda row: row.requests, default=None)

    chart_data = []
    daily_breakdown = []
    previous_requests = None

    for row in rows:
        change = 0 if previous_requests is None else row.requests - previous_requests

        percentage = (
            0
            if previous_requests is None or previous_requests == 0
            else round((change / previous_requests) * 100, 2)
        )

        chart_data.append({
            "date": row.date.strftime("%b %d"),
            "requests": row.requests
        })

        daily_breakdown.append({
            "date": row.date.strftime("%B %d, %Y"),
            "requests": row.requests,
            "change": change,
            "percentage": percentage
        })

        previous_requests = row.requests

    return {
        "cards": {
            "total_appointments": total_requests,
            "daily_average": daily_average,
            "highest_day": {
                "date": highest_day.date.strftime("%B %d, %Y") if highest_day else "No data",
                "requests": highest_day.requests if highest_day else 0
            },
            "lowest_day": {
                "date": lowest_day.date.strftime("%B %d, %Y") if lowest_day else "No data",
                "requests": lowest_day.requests if lowest_day else 0
            }
        },
        "chart": chart_data,
        "daily_breakdown": daily_breakdown
    }



@app.get("/api/analytics/front-desk")
def front_desk_details(
    month: int = Query(...),
    year: int = Query(...),
    db=Depends(get_db)
):
    date_col = cast(AicallmetricsCreate.call_timestamp, Date)

    stmt = (
        select(
            date_col.label("date"),
            func.count(AicallmetricsCreate.id).label("requests")
        )
        .where(extract("month", AicallmetricsCreate.call_timestamp) == month)
        .where(extract("year", AicallmetricsCreate.call_timestamp) == year)
        .where(
            AicallmetricsCreate.final_output == "Front Desk Request"
        )
        .group_by(date_col)
        .order_by(date_col)
    )

    rows = db.execute(stmt).all()

    total_requests = sum(row.requests for row in rows)

    daily_average = (
        round(total_requests / len(rows), 2)
        if rows else 0
    )

    highest_day = max(
        rows,
        key=lambda row: row.requests,
        default=None
    )

    lowest_day = min(
        rows,
        key=lambda row: row.requests,
        default=None
    )

    chart_data = []
    daily_breakdown = []

    previous_requests = None

    for row in rows:

        change = (
            0
            if previous_requests is None
            else row.requests - previous_requests
        )

        percentage = (
            0
            if previous_requests in [None, 0]
            else round(
                (change / previous_requests) * 100,
                2
            )
        )

        chart_data.append({
            "date": row.date.strftime("%b %d"),
            "requests": row.requests
        })

        daily_breakdown.append({
            "date": row.date.strftime("%B %d, %Y"),
            "requests": row.requests,
            "change": change,
            "percentage": percentage
        })

        previous_requests = row.requests

    return {
        "cards": {
            "FrontDesk_request": total_requests,
            "daily_average": daily_average,
            "highest_day": {
                "date":
                    highest_day.date.strftime("%B %d, %Y")
                    if highest_day else "No data",
                "requests":
                    highest_day.requests
                    if highest_day else 0
            },
            "lowest_day": {
                "date":
                    lowest_day.date.strftime("%B %d, %Y")
                    if lowest_day else "No data",
                "requests":
                    lowest_day.requests
                    if lowest_day else 0
            }
        },
        "chart": chart_data,
        "daily_breakdown": daily_breakdown
    }


@app.get("/api/analytics/silent-calls")
def front_desk_details(
    month: int = Query(...),
    year: int = Query(...),
    db=Depends(get_db)
):
    date_col = cast(AicallmetricsCreate.call_timestamp, Date)

    stmt = (
        select(
            date_col.label("date"),
            func.count(AicallmetricsCreate.id).label("requests")
        )
        .where(extract("month", AicallmetricsCreate.call_timestamp) == month)
        .where(extract("year", AicallmetricsCreate.call_timestamp) == year)
        .where(
            AicallmetricsCreate.final_output == "No User Request (Silent Call)"
        )
        .group_by(date_col)
        .order_by(date_col)
    )

    rows = db.execute(stmt).all()

    total_requests = sum(row.requests for row in rows)

    daily_average = (
        round(total_requests / len(rows), 2)
        if rows else 0
    )

    highest_day = max(
        rows,
        key=lambda row: row.requests,
        default=None
    )

    lowest_day = min(
        rows,
        key=lambda row: row.requests,
        default=None
    )

    chart_data = []
    daily_breakdown = []

    previous_requests = None

    for row in rows:

        change = (
            0
            if previous_requests is None
            else row.requests - previous_requests
        )

        percentage = (
            0
            if previous_requests in [None, 0]
            else round(
                (change / previous_requests) * 100,
                2
            )
        )

        chart_data.append({
            "date": row.date.strftime("%b %d"),
            "requests": row.requests
        })

        daily_breakdown.append({
            "date": row.date.strftime("%B %d, %Y"),
            "requests": row.requests,
            "change": change,
            "percentage": percentage
        })

        previous_requests = row.requests

    return {
        "cards": {
            "SilentCall_request": total_requests,
            "daily_average": daily_average,
            "highest_day": {
                "date":
                    highest_day.date.strftime("%B %d, %Y")
                    if highest_day else "No data",
                "requests":
                    highest_day.requests
                    if highest_day else 0
            },
            "lowest_day": {
                "date":
                    lowest_day.date.strftime("%B %d, %Y")
                    if lowest_day else "No data",
                "requests":
                    lowest_day.requests
                    if lowest_day else 0
            }
        },
        "chart": chart_data,
        "daily_breakdown": daily_breakdown
    }


#-------------------------------
#        Clinic-Request api
#-------------------------------------

@app.get("/api/analytics/clinic")
def clinic_analytics(
    month: int = Query(...),
    year: int = Query(...),
    db=Depends(get_db)
):
    stmt = (
        select(
            AicallmetricsCreate.clinic_name,
            AicallmetricsCreate.final_output,
            AicallmetricsCreate.completion_data,
            AicallmetricsCreate.blocker_data,
        )
        .where(extract("month", AicallmetricsCreate.call_timestamp) == month)
        .where(extract("year", AicallmetricsCreate.call_timestamp) == year)
    )

    records = db.execute(stmt).all()

    clinic_map = defaultdict(lambda: {
        "total_requests": 0,
        "request_types": Counter(),
        "completed": 0,
        "blocked": 0,
        "durations": []
    })

    def is_blocked(blocker_data):
     if not blocker_data:
        return False

     if isinstance(blocker_data, dict):
        has_blocker = blocker_data.get("has_blocker")
        blocked = blocker_data.get("blocked")
        is_blocked_value = blocker_data.get("is_blocked")
        blocker_reason = blocker_data.get("blocker_reason")
        reason = blocker_data.get("reason")

        return (
            has_blocker is True
            or blocked is True
            or is_blocked_value is True
            or bool(blocker_reason)
            or bool(reason)
        )

     return False

    def get_duration_seconds(completion_data):
        if not completion_data:
            return 0

        value = (
            completion_data.get("duration_seconds")
            or completion_data.get("call_duration")
            or completion_data.get("duration")
            or 0
        )

        try:
            return int(value)
        except:
            return 0

    for row in records:
        clinic_name = row.clinic_name or "Unknown Clinic"
        request_type = row.final_output or "Unknown Request"

        clinic_map[clinic_name]["total_requests"] += 1
        clinic_map[clinic_name]["request_types"][request_type] += 1

        if is_blocked(row.blocker_data):
            clinic_map[clinic_name]["blocked"] += 1
        else:
            clinic_map[clinic_name]["completed"] += 1

        duration = get_duration_seconds(row.completion_data)
        if duration:
            clinic_map[clinic_name]["durations"].append(duration)

    overview = []

    total_requests = sum(
        item["total_requests"] for item in clinic_map.values()
    )

    for clinic_name, item in clinic_map.items():
        top_request_type = (
            item["request_types"].most_common(1)[0][0]
            if item["request_types"]
            else "No data"
        )

        avg_seconds = (
            sum(item["durations"]) // len(item["durations"])
            if item["durations"]
            else 0
        )

        overview.append({
            "clinic_name": clinic_name,
            "total_requests": item["total_requests"],
            "percentage": round((item["total_requests"] / total_requests) * 100, 2)
            if total_requests else 0,
            "top_request_type": top_request_type,
            "completed": item["completed"],
            "blocked": item["blocked"],
            "avg_duration": f"{avg_seconds // 60:02d}:{avg_seconds % 60:02d}"
        })

    overview.sort(key=lambda x: x["total_requests"], reverse=True)

    top_clinic = overview[0] if overview else None
    lowest_clinic = overview[-1] if overview else None

    return {
        "cards": {
            "total_requests": total_requests,
            "top_clinic": {
                "clinic_name": top_clinic["clinic_name"] if top_clinic else "No data",
                "requests": top_clinic["total_requests"] if top_clinic else 0
            },
            "lowest_clinic": {
                "clinic_name": lowest_clinic["clinic_name"] if lowest_clinic else "No data",
                "requests": lowest_clinic["total_requests"] if lowest_clinic else 0
            },
            "total_clinics": len(overview)
        },
        "clinic_chart": [
            {
                "clinic_name": item["clinic_name"],
                "requests": item["total_requests"]
            }
            for item in overview
        ],
        "share_chart": [
            {
                "clinic_name": item["clinic_name"],
                "requests": item["total_requests"],
                "percentage": item["percentage"]
            }
            for item in overview
        ],
        "overview": overview
    }

#-------------------------
#-----monthly request-----
#-------------------------






@app.get("/api/analytics/monthly-requests")
def monthly_requests_details(
    month: int = Query(...),
    year: int = Query(...),
    clinic: str | None = Query(None),
    db=Depends(get_db)
):
    date_col = cast(AicallmetricsCreate.call_timestamp, Date)

    base_filters = [
        extract("month", AicallmetricsCreate.call_timestamp) == month,
        extract("year", AicallmetricsCreate.call_timestamp) == year,
    ]

    if clinic:
        base_filters.append(AicallmetricsCreate.clinic_name == clinic)

    daily_stmt = (
        select(
            date_col.label("date"),
            func.count(AicallmetricsCreate.id).label("requests")
        )
        .where(*base_filters)
        .group_by(date_col)
        .order_by(date_col)
    )

    daily_rows = db.execute(daily_stmt).all()

    daily_map = {
        row.date: row.requests
        for row in daily_rows
    }

    days_in_month = calendar.monthrange(year, month)[1]

    chart_data = []
    daily_breakdown = []

    previous_requests = None
    total_requests = 0
    highest_day = None
    lowest_day = None
    days_with_requests = 0
    days_with_no_requests = 0

    for day in range(1, days_in_month + 1):
        current_date = date(year, month, day)
        requests = daily_map.get(current_date, 0)

        total_requests += requests

        if requests > 0:
            days_with_requests += 1
        else:
            days_with_no_requests += 1

        if highest_day is None or requests > highest_day["requests"]:
            highest_day = {
                "date": current_date,
                "requests": requests
            }

        if lowest_day is None or requests < lowest_day["requests"]:
            lowest_day = {
                "date": current_date,
                "requests": requests
            }

        change = 0 if previous_requests is None else requests - previous_requests

        percentage = (
            0
            if previous_requests is None or previous_requests == 0
            else round((change / previous_requests) * 100, 2)
        )

        chart_data.append({
            "date": current_date.strftime("%b %d"),
            "requests": requests
        })

        daily_breakdown.append({
            "date": current_date.strftime("%B %d, %Y"),
            "requests": requests,
            "change": change,
            "percentage": percentage
        })

        previous_requests = requests

    daily_average = round(total_requests / days_in_month, 2) if days_in_month else 0

    clinic_filters = [
        extract("month", AicallmetricsCreate.call_timestamp) == month,
        extract("year", AicallmetricsCreate.call_timestamp) == year,
    ]

    if clinic:
        clinic_filters.append(AicallmetricsCreate.clinic_name == clinic)

    clinic_stmt = (
        select(
            AicallmetricsCreate.clinic_name,
            func.count(AicallmetricsCreate.id).label("requests")
        )
        .where(*clinic_filters)
        .group_by(AicallmetricsCreate.clinic_name)
        .order_by(func.count(AicallmetricsCreate.id).desc())
    )

    clinic_rows = db.execute(clinic_stmt).all()

    requests_by_clinic = []

    for row in clinic_rows:
        percentage = (
            round((row.requests / total_requests) * 100, 2)
            if total_requests
            else 0
        )

        requests_by_clinic.append({
            "clinic_name": row.clinic_name or "Unknown Clinic",
            "requests": row.requests,
            "percentage": percentage
        })

    clinics_stmt = (
        select(AicallmetricsCreate.clinic_name)
        .where(
            extract("year", AicallmetricsCreate.call_timestamp) == year
        )
        .group_by(AicallmetricsCreate.clinic_name)
        .order_by(AicallmetricsCreate.clinic_name)
    )

    clinic_options = [
        row.clinic_name
        for row in db.execute(clinics_stmt).all()
        if row.clinic_name
    ]

    return {
        "cards": {
            "total_requests": total_requests,
            "daily_average": daily_average,
            "highest_day": {
                "date": highest_day["date"].strftime("%B %d, %Y") if highest_day else "No data",
                "requests": highest_day["requests"] if highest_day else 0
            },
            "lowest_day": {
                "date": lowest_day["date"].strftime("%B %d, %Y") if lowest_day else "No data",
                "requests": lowest_day["requests"] if lowest_day else 0
            }
        },
        "monthly_summary": {
            "total_requests": total_requests,
            "average_per_day": daily_average,
            "highest_day": highest_day["date"].strftime("%B %d, %Y") if highest_day else "No data",
            "highest_day_requests": highest_day["requests"] if highest_day else 0,
            "lowest_day": lowest_day["date"].strftime("%B %d, %Y") if lowest_day else "No data",
            "lowest_day_requests": lowest_day["requests"] if lowest_day else 0,
            "days_with_requests": days_with_requests,
            "days_with_no_requests": days_with_no_requests
        },
        "chart": chart_data,
        "daily_breakdown": daily_breakdown,
        "requests_by_clinic": requests_by_clinic,
        "clinic_options": clinic_options
    }

#-------------------------------------
#--------request type----------

#----------------------------------





@app.get("/api/analytics/request-types")
def request_types_details(
    month: int = Query(...),
    year: int = Query(...),
    request_type: str | None = Query(None),
    db=Depends(get_db)
):
    stmt = (
        select(
            AicallmetricsCreate.call_id,
            AicallmetricsCreate.clinic_name,
            AicallmetricsCreate.call_timestamp,
            AicallmetricsCreate.final_output,
            AicallmetricsCreate.completion_data,
            AicallmetricsCreate.blocker_data,
        )
        .where(extract("month", AicallmetricsCreate.call_timestamp) == month)
        .where(extract("year", AicallmetricsCreate.call_timestamp) == year)
    )

    if request_type:
        stmt = stmt.where(AicallmetricsCreate.final_output == request_type)

    records = db.execute(stmt).all()

    def is_blocked(blocker_data):
        if not blocker_data:
            return False

        if isinstance(blocker_data, dict):
            return (
                blocker_data.get("has_blocker") is True
                or blocker_data.get("blocked") is True
                or blocker_data.get("is_blocked") is True
                or bool(blocker_data.get("blocker_reason"))
                or bool(blocker_data.get("reason"))
            )

        return False

    def get_duration_seconds(completion_data):
        if not completion_data:
            return 0

        value = (
            completion_data.get("duration_seconds")
            or completion_data.get("call_duration")
            or completion_data.get("duration")
            or 0
        )

        try:
            return int(value)
        except:
            return 0

    def format_duration(seconds):
        return f"{seconds // 60:02d}:{seconds % 60:02d}"

    request_map = defaultdict(lambda: {
        "total_requests": 0,
        "completed": 0,
        "blocked": 0,
        "durations": []
    })

    recent_requests = []

    for row in records:
        req_type = row.final_output or "Unknown Request"

        request_map[req_type]["total_requests"] += 1

        blocked = is_blocked(row.blocker_data)

        if blocked:
            request_map[req_type]["blocked"] += 1
            status = "Blocked"
        else:
            request_map[req_type]["completed"] += 1
            status = "Completed"

        duration_seconds = get_duration_seconds(row.completion_data)

        if duration_seconds:
            request_map[req_type]["durations"].append(duration_seconds)

        recent_requests.append({
            "time": row.call_timestamp.strftime("%B %d, %Y %I:%M %p"),
            "call_id": row.call_id,
            "clinic": row.clinic_name or "Unknown Clinic",
            "request_type": req_type,
            "status": status,
            "duration": format_duration(duration_seconds)
        })

    total_requests = sum(item["total_requests"] for item in request_map.values())
    total_completed = sum(item["completed"] for item in request_map.values())
    total_blocked = sum(item["blocked"] for item in request_map.values())

    all_durations = []
    for item in request_map.values():
        all_durations.extend(item["durations"])

    avg_completion_seconds = (
        sum(all_durations) // len(all_durations)
        if all_durations else 0
    )

    overview = []

    for req_type, item in request_map.items():
        avg_seconds = (
            sum(item["durations"]) // len(item["durations"])
            if item["durations"] else 0
        )

        completion_rate = (
            round((item["completed"] / item["total_requests"]) * 100, 2)
            if item["total_requests"] else 0
        )

        overview.append({
            "request_type": req_type,
            "total_requests": item["total_requests"],
            "percentage": round((item["total_requests"] / total_requests) * 100, 2)
            if total_requests else 0,
            "completed": item["completed"],
            "blocked": item["blocked"],
            "completion_rate": completion_rate,
            "avg_duration": format_duration(avg_seconds)
        })

    overview.sort(key=lambda x: x["total_requests"], reverse=True)

    request_distribution = [
        {
            "request_type": item["request_type"],
            "requests": item["total_requests"],
            "percentage": item["percentage"]
        }
        for item in overview
    ]

    request_options = [item["request_type"] for item in overview]

    recent_requests.sort(key=lambda x: x["time"], reverse=True)

    overall_completion_rate = (
        round((total_completed / total_requests) * 100, 2)
        if total_requests else 0
    )

    return {
        "cards": {
            "total_request_types": len(overview),
            "completed_requests": total_completed,
            "completed_percentage": overall_completion_rate,
            "blocked_requests": total_blocked,
            "blocked_percentage": round((total_blocked / total_requests) * 100, 2)
            if total_requests else 0,
            "avg_completion_time": format_duration(avg_completion_seconds)
        },
        "total_requests": total_requests,
        "request_distribution": request_distribution,
        "overview": overview,
        "recent_requests": recent_requests[:10],
        "request_options": request_options
    }








# #     cursor.close()

# #     return result

# @app.get("/api/filter/clinic/{clinic}")
# def filter_by_clinic(clinic: str,db=Depends(get_db)):   
#         stmt = (select(Aicallmetrics.month_name,Aicallmetrics.clinic_name,Aicallmetrics.user_request)
#              .where(Aicallmetrics.clinic_name == clinic))   
#         rows = db.execute(stmt).mappings().all()
#         results = []
#         for row in rows:
#             short_month = row.month_name.strftime("%b")
#             results.append({
#                   "month_name": short_month,
#                   "clinic_name": row.clinic_name,
#                   "user_request": row.user_request
#             })
#         return results



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




# @app.get("/api/clinic-requests/month/{month}")
# def clinic_requests_by_month(month:str,db=Depends(get_db)):     
#         try:
#              month_number = datetime.strptime(month.title(),"%b").month
             
#         except ValueError:
#              raise HTTPException(status=404,detail = "invalid month use 'jan','feb,'mar'...")

#         stmt = (select(Aicallmetrics.clinic_name,
#                func.count(Aicallmetrics.user_request).label("total_requests"))
#                .where(extract('month',Aicallmetrics.month_name)== month_number)
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


# --------------------------------------------------------------------------------
#                             Report Generation Endpoints
# -----------------------------------------------------------------------------



# @app.get("/api/reports")
# def get_reports(
#     clinic: str = None,
#     month: str = None,
#     request_type: str = None,
#     db=Depends(get_db)
# ):

#     stmt = select(
#         Aicallmetrics.month_name,
#         Aicallmetrics.clinic_name,
#         Aicallmetrics.user_request
#     )

#     if clinic:
#         stmt = stmt.where(
#             Aicallmetrics.clinic_name == clinic
#         )

#     if month:
#         stmt = stmt.where( func.date_format(Aicallmetrics.month_name,"%b") == month)

#     rows = db.execute(stmt).mappings().all()

#     results = []

#     for row in rows:

#         short_month = row.month_name.strftime("%b")

#         results.append({
#             "month_name": short_month,
#             "clinic_name": row.clinic_name,
#             "user_request": row.user_request
#         })

#     return results