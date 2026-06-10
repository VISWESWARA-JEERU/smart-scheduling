
# from fastapi import FastAPI,Depends,HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from database import sessionlocal ,engine
# import  database_models 
# from  database_models import  AicallmetricsCreate
# from sqlalchemy import select,func,desc,extract
# from datetime import datetime

# app = FastAPI()

# database_models.Base.metadata.create_all(bind=engine)

# # http://localhost:5173",
# #        "https://smart-scheduling-2ymx154p3-visweswara-jeeru-s-projects.vercel.app/
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# @app.get("/")
# def read_root():    
#     return {"message": "Welcome to the AI Call Metrics API!"}

# def get_db():
#     db = sessionlocal()
#     try:
#         yield db
#     finally:
#         db.close() 



