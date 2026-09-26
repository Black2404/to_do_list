import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Task, TaskCreate, TaskUpdate, DeleteTaskResponse } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private http = inject(HttpClient);

  private apiUrl = 'http://127.0.0.1:8000';

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`);
  }

  getTask(task_id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/tasks/${task_id}`);
  }

  postTask(task: TaskCreate): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, task);
  }

  putTask(task_id: string, task: TaskUpdate) : Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${task_id}`, task);
  }

  deleteTask(task_id: string) : Observable<DeleteTaskResponse>{
    return this.http.delete<DeleteTaskResponse>(`${this.apiUrl}/tasks/${task_id}`);
  }

} 