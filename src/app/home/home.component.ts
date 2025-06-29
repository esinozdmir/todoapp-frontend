import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task } from '../models/task.model';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../core/services/task.services';
import { Router } from '@angular/router';
import { User } from '../models/user.model';



@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, DragDropModule, FormsModule]
})
export class HomeComponent implements OnInit {
  todo: Task[] = [];
  in_progress: Task[] = [];
  review: Task[] = [];
  done: Task[] = [];

  users: User[] = [];
  
  newTaskTitle = '';
  newTaskDescription = '';
  selectedUserId: number | null = null;
  showTaskForm = false;
  
  showUserForm = false;
  newUserFirstName = '';
  newUserLastName = '';
  newUserEmail = '';

  editingTask: Task | null = null;
  editingTitle = '';
  editingDescription = '';
  editingAssignedUserId: number | null = null;

  assigningTask: Task | null = null;
  tempAssignedUserId: number | null = null;

  columns = ['todo', 'in_progress', 'review', 'done'];
  columnTitles = {
    todo: 'To Do',
    in_progress: 'In Progress',
    review: 'Review',
    done: 'Done'
  };

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit() {
    this.loadTasks();
    this.loadUsers();
  }

  loadTasks() {
    this.taskService.getAllTasks().subscribe(tasks => {
      this.todo = tasks.filter(t => t.status === 'todo');
      this.in_progress = tasks.filter(t => t.status === 'in_progress');
      this.review = tasks.filter(t => t.status === 'review');
      this.done = tasks.filter(t => t.status === 'done');
    });
  }

  loadUsers() {
    this.taskService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  getTasks(column: string): Task[] {
    return this[column as keyof HomeComponent] as Task[];
  }

  getColumnTitle(column: string): string {
    return this.columnTitles[column as keyof typeof this.columnTitles];
  }

  drop(event: CdkDragDrop<Task[]>, newStatus: string) {
    const task = event.previousContainer.data[event.previousIndex];
    if (event.previousContainer === event.container) return;

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    const updatedTask = {
      ...task,
      status: newStatus as 'todo' | 'in_progress' | 'review' | 'done'
    };

    this.taskService.updateTask(task.id, updatedTask).subscribe({
      next: (response) => {
        console.log('Task updated successfully:', response);
        task.status = newStatus as any;
      },
      error: (error) => {
        console.error('Error updating task:', error);
        this.loadTasks();
      }
    });
  }

  addTask() {
    if (!this.newTaskTitle.trim()) return;

    const newTask = {
      title: this.newTaskTitle.trim(),
      description: this.newTaskDescription.trim() || undefined,
      status: 'todo' as const,
      assignedUserId: this.selectedUserId || undefined
    };

    this.taskService.createTask(newTask).subscribe({
      next: (task) => {
        this.todo.push(task);
        this.clearTaskForm();
        console.log('Task created successfully:', task);
      },
      error: (error) => {
        console.error('Error creating task:', error);
      }
    });
  }

  clearTaskForm() {
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.selectedUserId = null;
    this.showTaskForm = false;
  }

  toggleTaskForm() {
    this.showTaskForm = !this.showTaskForm;
    if (!this.showTaskForm) {
      this.clearTaskForm();
    }
  }

  startEditTask(task: Task) {
    this.editingTask = task;
    this.editingTitle = task.title;
    this.editingDescription = task.description || '';
    this.editingAssignedUserId = task.assignedUser?.id || null;
    this.assigningTask = null;
  }

  saveTaskEdit() {
    if (!this.editingTask || !this.editingTitle.trim()) return;

    const updatedTask = {
      ...this.editingTask,
      title: this.editingTitle.trim(),
      description: this.editingDescription.trim() || undefined,
      assignedUserId: this.editingAssignedUserId || undefined
    };

    this.taskService.updateTask(this.editingTask.id, updatedTask).subscribe({
      next: (task) => {
        this.editingTask!.title = task.title;
        this.editingTask!.description = task.description;
        this.editingTask!.assignedUser!.id = task.assignedUser!.id;
        this.editingTask!.assignedUser = task.assignedUser;
        this.cancelEdit();
        console.log('Task updated successfully:', task);
      },
      error: (error) => {
        console.error('Error updating task:', error);
        this.cancelEdit();
      }
    });
  }

  cancelEdit() {
    this.editingTask = null;
    this.editingTitle = '';
    this.editingDescription = '';
    this.editingAssignedUserId = null;
  }

  toggleAssignMenu(task: Task) {
    if (this.assigningTask?.id === task.id) {
      this.assigningTask = null;
      this.tempAssignedUserId = null;
    } else {
      this.assigningTask = task;
      this.tempAssignedUserId = task.assignedUser?.id || null;
      this.editingTask = null;
    }
  }

  assignTaskToUser(task: Task, userId: number | null) {
    const updatedTask = {
      ...task,
      assignedUserId: userId || undefined
    };

    this.taskService.updateTask(task.id, updatedTask).subscribe({
      next: (updatedTaskResponse) => {
        task.assignedUser!.id = updatedTaskResponse.assignedUser!.id;
        task.assignedUser = updatedTaskResponse.assignedUser;
        
        this.assigningTask = null;
        this.tempAssignedUserId = null;
        
        console.log('Task assignment updated successfully:', updatedTaskResponse);
      },
      error: (error) => {
        console.error('Error updating task assignment:', error);
        this.assigningTask = null;
        this.tempAssignedUserId = null;
      }
    });
  }
  deleteTask(task: Task) {
  console.log('Silinecek task:', task);

  this.taskService.deleteTask(task.id).subscribe({
    next: (response) => {
      console.log('Task deleted successfully:', response);
      this.loadTasks();
    },
    error: (error) => {
      console.error('Error deleting task:', error); 
    }
  });
}



  getUserFullName(user: User): string {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim();
  }

  
}