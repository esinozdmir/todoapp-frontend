import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./core/features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./core/features/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'users',
    loadComponent: () =>
    import('./core/features/users/user-list/user-list.component').then((m) => m.UserListComponent),  
  },

  {
  path: 'my-tasks',
  loadComponent: () => 
  import('./core/features/my-tasks/my-tasks.component').then(m => m.MyTasksComponent)
}


];
