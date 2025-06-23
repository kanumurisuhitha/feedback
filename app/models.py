from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String)
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    manager_secret_hash = Column(String, nullable=True)  # 🔥 New column

    feedback_given = relationship("Feedback", back_populates="manager", foreign_keys="Feedback.manager_id")
    feedback_received = relationship("Feedback", back_populates="employee", foreign_keys="Feedback.employee_id")



class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, index=True)
    strengths = Column(String)
    improvements = Column(String)
    sentiment = Column(String)
    response_text = Column(String, nullable=True)
    anonymous = Column(Boolean, default=False)
    tags = Column(String, nullable=True)

    employee_id = Column(Integer, ForeignKey("users.id"))
    manager_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    employee = relationship("User", back_populates="feedback_received", foreign_keys=[employee_id])
    manager = relationship("User", back_populates="feedback_given", foreign_keys=[manager_id])


class FeedbackRequest(Base):
    __tablename__ = "feedback_requests"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("users.id"))
    manager_id = Column(Integer, ForeignKey("users.id"))
    reason = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class FeedbackComment(Base):
    __tablename__ = "feedback_comments"
    id = Column(Integer, primary_key=True, index=True)
    feedback_id = Column(Integer, ForeignKey("feedback.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    comment = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    message = Column(String)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

