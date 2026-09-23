from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

# Task schemas
class PriorityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100, description="The title of the task")
    description: Optional[str] = Field(None, max_length=500, description="The description of the task")
    is_completed: bool = Field(default=False, description="Whether the task is completed or not")
    priority: PriorityEnum = Field(default=PriorityEnum.low, description="The priority of the task (low, medium, high)")
    due_date: Optional[datetime] = Field(None, description="The due date of the task in YYYY-MM-DD format")

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    is_completed: Optional[bool] = None
    priority: Optional[PriorityEnum] = None
    due_date: Optional[datetime] = None

class TaskResponse(TaskBase):
    id: str
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)