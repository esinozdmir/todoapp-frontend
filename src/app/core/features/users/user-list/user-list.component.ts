import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../models/user.model';
import { TaskService } from '../../../services/task.services';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  providers: [TaskService], 
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Kullanıcılar alınamadı:', err);
      }
    });
  }

  isAdmin(user: User): boolean {
    return user.id === 6;
  }
}
