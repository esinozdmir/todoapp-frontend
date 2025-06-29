import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.services';
import { User } from '../../../../models/user.model';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';
  
  errors = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  validatePassword() {
  const password = this.password;

  const errors: string[] = [];

  if (password.length < 6) {
    errors.push('En az 6 karakter\n');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('En az 1 büyük harf\n');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('En az 1 küçük harf\n');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('En az 1 rakam\n');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('En az 1 özel karakter (!@#...)\n');
  }

  if (errors.length > 0) {
    this.errors.password = errors.join(', ');
  } else {
    this.errors.password = '';
  }

  this.validateConfirmPassword();
}

validateEmail() {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(this.email)) {
    this.errors.email = 'Geçerli bir email adresi girin';
  } else {
    this.errors.email = '';
  }
}



  validateConfirmPassword() {
    if (this.confirmPassword && this.password !== this.confirmPassword) {
      this.errors.confirmPassword = 'Şifreler eşleşmiyor';
    } else {
      this.errors.confirmPassword = '';
    }
  }

  isFormValid(): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return this.firstName.length > 0 && 
           this.lastName.length > 0 && 
           emailPattern.test(this.email) &&
           this.password.length >= 6 && 
           this.confirmPassword.length > 0 && 
           this.password === this.confirmPassword;
  }

  onSubmit() {
    this.validateEmail(); 
    this.validatePassword();
    this.validateConfirmPassword();

    if (!this.isFormValid()) {
      this.errorMessage = 'Lütfen tüm alanları doğru doldurun';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const user: User = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    };

    this.userService.register(user).subscribe({
      next: () => {
        this.isLoading = false;
        alert("Kayıt başarılı!");
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        if (err.status === 400) {
          const errorMessage = err.error?.message || err.error || "Geçersiz istek";
          this.errorMessage = errorMessage;
        } else {
          this.errorMessage = "Bilinmeyen bir hata oluştu";
        }
      }
    });
  }

  goToLogin() {
    console.log("106")
    this.router.navigate(['/login']);
    console.log("108")
  }
}