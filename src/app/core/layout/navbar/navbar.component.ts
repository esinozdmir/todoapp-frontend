import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports:[RouterModule]
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      this.currentUser = JSON.parse(userString);
    }
  }

 logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    this.router.navigate(['/login']);
  }


goToUsers() {
  this.router.navigate(['/users']);
}
}
