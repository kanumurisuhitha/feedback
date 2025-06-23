from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas, database

router = APIRouter(prefix="/feedback", tags=["feedback"])

@router.post("/", response_model=schemas.FeedbackOut)
@router.post("/", response_model=schemas.FeedbackOut)
def create_feedback(data: schemas.FeedbackCreate, db: Session = Depends(database.get_db)):
    fb = models.Feedback(
        manager_id=data.manager_id,
        employee_id=data.employee_id,
        strengths=data.strengths,
        improvements=data.improvements,
        sentiment=data.sentiment
    )
    db.add(fb)
    db.commit()
    db.refresh(fb)
    
    # ✅ Create notification for employee
    notif = models.Notification(
        user_id=data.employee_id,
        message=f"You received new feedback from Manager {data.manager_id}"
    )
    db.add(notif)
    db.commit()

    return fb


@router.get("/employee/{employee_id}", response_model=list[schemas.FeedbackOut])
def get_employee_feedback(employee_id: int, db: Session = Depends(database.get_db)):
    return db.query(models.Feedback).filter(models.Feedback.employee_id == employee_id).all()

@router.get("/manager/{manager_id}", response_model=list[schemas.FeedbackOut])
def get_manager_feedback(manager_id: int, db: Session = Depends(database.get_db)):
    return db.query(models.Feedback).filter(models.Feedback.manager_id == manager_id).all()

@router.get("/", response_model=list[schemas.FeedbackOut])  
def get_all_feedback(db: Session = Depends(database.get_db)):
    return db.query(models.Feedback).all()

@router.put("/{feedback_id}", response_model=schemas.FeedbackOut)
def update_feedback(feedback_id: int, data: schemas.FeedbackCreate, db: Session = Depends(database.get_db)):
    fb = db.query(models.Feedback).filter(models.Feedback.id == feedback_id).first()
    if not fb:
        raise HTTPException(status_code=404, detail="Feedback not found")
    fb.strengths = data.strengths
    fb.improvements = data.improvements
    fb.sentiment = data.sentiment
    db.commit()
    db.refresh(fb)

    # Send notification to employee after update
    notif = models.Notification(
        user_id=fb.employee_id,
        message=f"Your feedback from Manager {fb.manager_id} has been updated"
    )
    db.add(notif)
    db.commit()

    return fb


@router.delete("/{feedback_id}")
def delete_feedback(feedback_id: int, db: Session = Depends(database.get_db)):
    fb = db.query(models.Feedback).filter(models.Feedback.id == feedback_id).first()
    if not fb:
        raise HTTPException(status_code=404, detail="Feedback not found")

    # Create notification before deleting
    notif = models.Notification(
        user_id=fb.employee_id,
        message=f"Your feedback from Manager {fb.manager_id} has been deleted"
    )
    db.add(notif)

    db.delete(fb)
    db.commit()

    return {"message": "Feedback deleted"}

@router.post("/reply/{feedback_id}")
def employee_reply(feedback_id: int, reply: schemas.FeedbackResponse, db: Session = Depends(database.get_db)):
    fb = db.query(models.Feedback).filter(models.Feedback.id == feedback_id).first()
    if not fb:
        raise HTTPException(status_code=404, detail="Feedback not found")
    fb.response_text = reply.text
    db.commit()
    db.refresh(fb)

    # Create notification
    notif = models.Notification(
        user_id=fb.manager_id,
        message=f"Employee {fb.employee_id} replied to feedback {fb.id}"
    )
    db.add(notif)
    db.commit()

    return {"message": "Reply submitted successfully"}

    return {"message": "Reply submitted successfully"}
@router.get("/notifications/{manager_id}")
def get_notifications(manager_id: int, db: Session = Depends(database.get_db)):
    return db.query(models.Notification).filter(
        models.Notification.user_id == manager_id,
        models.Notification.read == False
    ).order_by(models.Notification.created_at.desc()).all()

@router.post("/notifications/mark-read/{notification_id}")
def mark_notification_read(notification_id: int, db: Session = Depends(database.get_db)):
    notif = db.query(models.Notification).filter(models.Notification.id == notification_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.read = True
    db.commit()
    return {"message": "Notification marked as read"}
@router.get("/notifications/employee/{employee_id}")
def get_employee_notifications(employee_id: int, db: Session = Depends(database.get_db)):
    return db.query(models.Notification).filter(
        models.Notification.user_id == employee_id,
        models.Notification.read == False
    ).order_by(models.Notification.created_at.desc()).all()

