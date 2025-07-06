import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.services';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.css']
})
export class MyTasksComponent implements OnInit {
  tasks: Task[] = [];
  currentUserId = Number(JSON.parse(localStorage.getItem('user') || '{}')?.id);

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getAllTasks().subscribe((allTasks) => {
      this.tasks = allTasks.filter(task => task.assignedUser?.id === this.currentUserId);
    });
  }
}
