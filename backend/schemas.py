from typing import Optional
from pydantic import BaseModel, Field

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100, description="The title of the task")
    description: Optional[str] = Field(None, max_length=500, description="The description of the task")
    is_completed: bool = False

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    is_completed: Optional[bool] = None

class TaskResponse(TaskBase):
    id: str
    class Config:
        from_attributes = True