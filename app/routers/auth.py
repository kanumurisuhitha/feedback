from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas, database
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.schemas import ManagerSecretInput


SECRET_KEY = "your-secret-key"  # 🔑 Replace with a strong key in production!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter(prefix="/auth", tags=["auth"])

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(
        name=user.name,
        email=user.email,
        password_hash=hashed_password,
        role=user.role,
        manager_id=user.manager_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login")
def login(form_data: schemas.LoginInput, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.email).first()
    if not user or not pwd_context.verify(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if user.role == "employee":
        if form_data.manager_secret is None:
            raise HTTPException(status_code=400, detail="Manager secret required")

        manager = db.query(models.User).filter(models.User.id == user.manager_id).first()
        if not manager or not pwd_context.verify(form_data.manager_secret, manager.manager_secret_hash):
            raise HTTPException(status_code=401, detail="Invalid manager secret")

    token = create_access_token({"sub": str(user.id), "role": user.role})
    
    # 🔥 Add extra field for manager to check if secret is set
    manager_secret_set = True if user.role != "manager" else (user.manager_secret_hash is not None)

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role,
        "user_id": user.id,
        "manager_secret_set": manager_secret_set
    }


@router.post("/set-manager-secret")
def set_manager_secret(secret_data: ManagerSecretInput, db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.id == secret_data.manager_id, models.User.role == "manager").first()
    if not user:
        raise HTTPException(status_code=404, detail="Manager not found")
    
    hashed_secret = pwd_context.hash(secret_data.manager_secret)
    user.manager_secret_hash = hashed_secret
    db.commit()
    return {"message": "Manager secret set successfully"}
