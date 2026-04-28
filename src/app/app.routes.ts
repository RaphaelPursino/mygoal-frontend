import { Routes } from '@angular/router';
import { authGuard, noAuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
  },
  {
    path: 'auth/callback',
    loadComponent: () => import('./features/auth/callback/callback').then(m => m.Callback)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'goals/new',
    canActivate: [authGuard],
    loadComponent: () => import('./features/goal-create/goal-create').then(m => m.GoalCreate)
  },
  {
    path: 'goals/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/goal-detail/goal-detail').then(m => m.GoalDetail)
  },
  { path: '**', redirectTo: '/dashboard' }
];