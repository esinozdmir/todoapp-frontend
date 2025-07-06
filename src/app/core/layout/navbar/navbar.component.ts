import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../models/user.model';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [RouterModule, CommonModule]
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  private sub!: Subscription;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.sub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  logout() {
    this.authService.clearUser();
    this.router.navigate(['/login']);
  }

  goToUsers() {
    this.router.navigate(['/users']);
  }

  goToMyTasks() {
  this.router.navigate(['/my-tasks']);
}

}
