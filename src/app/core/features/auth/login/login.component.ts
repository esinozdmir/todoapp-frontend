import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.services';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService 
  ) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Lütfen e-posta ve şifrenizi girin';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.userService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Giriş başarılı', response);
              this.authService.setCurrentUser(response); 
        this.isLoading = false;

        localStorage.setItem('user', JSON.stringify(response));


        alert('Giriş başarılı!');
       this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Giriş başarısız', err);
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMessage = 'E-posta veya şifre hatalı';
        } else {
          this.errorMessage = 'Giriş başarısız! Tekrar deneyin.';
        }
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}