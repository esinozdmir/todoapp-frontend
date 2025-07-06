import { User } from "./user.model";

export interface Task {
  id: number;
  title: string;
  
  description?: string;
  
  status: 'todo' | 'in_progress' | 'review' | 'done';
  
  assignedUser?: User;
  deadline?: string;
}