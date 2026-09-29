import {
  ChangeDetectorRef,
  Component,
  inject
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task, TaskUpdate } from '../../models/task.model';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.scss',
  imports: [FormsModule]
})
export class TaskDetail {

  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  task: Task | null = null;

  isEditing = false;

  originalTask: Task | null = null;

  // GET /tasks/{task_id}
  ngOnInit(): void {

    const task_id = this.route.snapshot.paramMap.get('task_id');

    if (!task_id) {
      return;
    }

    this.loadTask(task_id);
  }

  loadTask(task_id: string): void {
    this.taskService.getTask(task_id).subscribe({
      next: (data) => {
        this.task = data;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Load task error:', error);
      }
    });
  }

  // Chuyển sang Edit
  editTask(): void {
    if (!this.task) {
      return;
    }
    // Lưu bản copy ban đầu
    this.originalTask = structuredClone(this.task);
    this.isEditing = true;
  }

  // Hủy Edit
  cancelEdit(): void {
    if (this.originalTask) {
      this.task = structuredClone(this.originalTask);
    }
    this.isEditing = false;
    this.cdr.detectChanges();
  }

  // PUT /tasks/{task_id}
  updateTask(): void {
    if (!this.task || !this.originalTask) {
      return;
    }
    // Không có thay đổi
    if (
      this.task.title === this.originalTask.title &&
      this.task.description === this.originalTask.description &&
      this.task.is_completed === this.originalTask.is_completed &&
      this.task.priority === this.originalTask.priority &&
      this.task.due_date === this.originalTask.due_date
    ) {
      return;
    }
    const task_data: TaskUpdate = {
      title: this.task.title,
      description: this.task.description,
      is_completed: this.task.is_completed,
      priority: this.task.priority,
      due_date: this.task.due_date

    };

    this.taskService.putTask(
      this.task.id,
      task_data
    ).subscribe({
      next: (data) => {
        // Nhận task mới từ BE
        this.task = data;
        // Lưu lại trạng thái mới
        this.originalTask = structuredClone(data);
        // Chuyển về View
        this.isEditing = false;
        // Cập nhật UI ngay
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(
          'Update task error:',
          error
        );
      }
    });
  }
}