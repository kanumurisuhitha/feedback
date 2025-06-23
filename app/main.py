from app.routers import manager_notification
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, user, feedback
from app.database import Base, engine
from app.routers import user  # make sure it's imported
app = FastAPI()


Base.metadata.create_all(bind=engine)


# 🚀 CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(feedback.router)
app.include_router(manager_notification.router)
@app.get("/")
def read_root():
    return {"message": "Feedback System API"}

