export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  priority: Priority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string | null;
  is_completed?: boolean;
  priority?: Priority;
  due_date?: string | null;
}

export interface TaskUpdate {
  title?: string;
  description?: string | null;
  is_completed?: boolean;
  priority?: Priority;
  due_date?: string | null;
}

export interface DeleteTaskResponse {
  message: string;
}