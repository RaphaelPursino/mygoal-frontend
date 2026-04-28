import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  private backendUrl = environment.apiUrl.replace('/api/v1', '');
  private userSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  register(req: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, req).pipe(
      tap(res => this.storeSession(res))
    );
  }

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, req).pipe(
      tap(res => this.storeSession(res))
    );
  }

  loginWithGoogle(): void {
    // Pega a URL base atual do frontend e substitui pelo backend
    const isProduction = window.location.hostname !== 'localhost';
    const backendUrl = isProduction
      ? 'https://mygoal-backend-production.up.railway.app'
      : 'http://localhost:8080';
    
    console.log('Backend URL:', backendUrl);
    window.location.href = `${backendUrl}/oauth2/authorization/google`;
  }

  handleOAuthCallback(token: string): void {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const user: User = { name: payload.name || payload.sub, email: payload.sub };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private storeSession(res: AuthResponse): void {
    localStorage.setItem('token', res.token);
    const user: User = { name: res.name, email: res.email, avatarUrl: res.avatarUrl };
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  private getStoredUser(): User | null {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }
}