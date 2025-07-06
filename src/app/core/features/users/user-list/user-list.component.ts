import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../models/user.model';
import { UserService } from '../../../services/user.services';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  providers: [UserService]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  editingUserId: number | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Kullanıcılar alınamadı:', err)
    });
  }

  editUser(id: number) {
    this.editingUserId = id;
  }

  cancelEdit() {
    this.editingUserId = null;
    this.loadUsers(); 
  }

  updateUser(user: User) {
    if (user.id) {
      this.userService.updateUser(user.id, user).subscribe({
        next: () => {
          alert('Kullanıcı güncellendi');
          this.editingUserId = null;
        },
        error: (err) => console.error('Güncelleme hatası:', err)
      });
    }
  }

  deleteUser(id?: number) {
    if (id && confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          alert('Kullanıcı silindi');
          this.users = this.users.filter(u => u.id !== id);
        },
        error: (err) => console.error('Silme hatası:', err)
      });
    }
  }

  isEditing(user: User): boolean {
    return user.id === this.editingUserId;
  }
}
