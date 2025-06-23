from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models, schemas, database

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/managers", response_model=list[schemas.UserOut])
def list_managers(db: Session = Depends(database.get_db)):
    return db.query(models.User).filter(models.User.role == "manager").all()

# 🔥 Updated my-employees route
@router.get("/my-employees", response_model=list[schemas.UserOut])
def my_employees(manager_id: int, db: Session = Depends(database.get_db)):
    return db.query(models.User).filter(models.User.manager_id == manager_id).all()
