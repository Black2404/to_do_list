from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from bson import ObjectId

from database import task_collection
from schemas import TaskCreate, TaskUpdate, TaskResponse

app = FastAPI(title="To Do List API")

# Cấu hình CORS để Frontend (Angular) gọi được API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cho phép mọi trang web (kể cả Angular localhost:4200) truy cập API
    allow_credentials=True, # Cho phép gửi kèm cookie hoặc thông tin xác thực
    allow_methods=["*"], # Cho phép gửi mọi lệnh HTTP (GET, POST, PUT, DELETE)
    allow_headers=["*"], # Cho phép gửi kèm mọi tiêu đề dữ liệu (Headers)
)

def task_helper(task) -> dict:
    return {
        "id": str(task["_id"]),
        "title": task["title"],
        "description": task.get("description"),
        "is_completed": task.get("is_completed", False)
    }

# Get all tasks
@app.get("/tasks", response_model=List[TaskResponse])
async def get_tasks(is_completed: Optional[bool] = None):
    query = {}
    if is_completed is not None:
        query["is_completed"] = is_completed
    tasks = []
    async for task in task_collection.find(query):
        tasks.append(task_helper(task))
    return tasks

# Get single task
@app.get("/tasks/{task_id}", response_model=TaskResponse)
async def get_task(task_id: str):
    if not ObjectId.is_valid(task_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid task ID")
    task = await task_collection.find_one({"_id": ObjectId(task_id)})
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task_helper(task)

# Create task
@app.post("/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(task_data: TaskCreate):
    new_task = task_data.model_dump()
    result = await task_collection.insert_one(new_task)
    created_task = await task_collection.find_one({"_id": result.inserted_id})
    return task_helper(created_task)

# Update task
@app.put("/tasks/{task_id}", response_model=TaskResponse)
async def update_task(task_id: str, task_data: TaskUpdate):
    if not ObjectId.is_valid(task_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid task ID")
    
    update_data = {k: v for k, v in task_data.model_dump().items() if v is not None}
    
    if update_data:
        await task_collection.update_one({"_id": ObjectId(task_id)}, {"$set": update_data})
        
    updated_task = await task_collection.find_one({"_id": ObjectId(task_id)})
    if not updated_task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task_helper(updated_task)

# Delete task
@app.delete("/tasks/{task_id}")
async def delete_task(task_id: str):
    if not ObjectId.is_valid(task_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid task ID")
    result = await task_collection.delete_one({"_id": ObjectId(task_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return {"message": "Task deleted successfully"}