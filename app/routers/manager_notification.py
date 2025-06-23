from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, database

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("/{manager_id}")
def get_notifications(manager_id: int, db: Session = Depends(database.get_db)):
    notifs = db.query(models.Notification).filter(
        models.Notification.user_id == manager_id,
        models.Notification.read == False
    ).all()
    return notifs

@router.post("/mark-read/{notif_id}")
def mark_notification_read(notif_id: int, db: Session = Depends(database.get_db)):
    notif = db.query(models.Notification).filter(models.Notification.id == notif_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.read = True
    db.commit()
    return {"message": "Notification marked as read"}
