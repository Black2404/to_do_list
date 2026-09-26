import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TaskService } from '../../services/task.service';
import { Priority, Task, TaskCreate } from '../../models/task.model';

@Component({
  imports: [RouterLink],
  selector: 'app-task-list',
  styleUrl: './task-list.scss',
  templateUrl: './task-list.html',
})
export class TaskList {

  private taskService = inject(TaskService);
  private cdr = inject(ChangeDetectorRef);

  tasks: Task[] = [];

  ngOnInit(): void {
    this.loadTasks();
  }

  // GET /tasks
  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;

        // Cập nhật UI ngay
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Load tasks error:', error);
      }
    });
  }

  // POST /tasks
  addTask(task: TaskCreate): void {
    this.taskService.postTask(task).subscribe({
      next: (data) => {
        console.log('Create task:', data);

        // Load lại danh sách từ BE
        this.loadTasks();
      },
      error: (error) => {
        console.error('Create task error:', error);
      }
    });
  }

  // DELETE /tasks/{task_id}
  deleteTask(task_id: string): void {
    this.taskService.deleteTask(task_id).subscribe({
      next: (data) => {
        console.log('Delete task:', data);

        // Load lại danh sách từ BE
        this.loadTasks();
      },
      error: (error) => {
        console.error('Delete task error:', error);
      }
    });
  }

  addTaskFromForm(
    title: string,
    description: string,
    priority: string,
    due_date: string
  ): void {

    this.addTask({
      title: title,
      description: description,
      priority: priority as Priority,
      is_completed: false,
      due_date: due_date || null
    });
  }
}