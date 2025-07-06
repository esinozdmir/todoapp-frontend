import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  clearUser() {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
  }
}
