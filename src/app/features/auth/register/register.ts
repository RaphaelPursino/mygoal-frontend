import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <div class="logo">
            <mat-icon>flag</mat-icon>
            <h1>MyGoal</h1>
          </div>
          <p class="subtitle">Crie sua conta e comece a conquistar suas metas</p>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nome completo</mat-label>
              <input matInput formControlName="name" placeholder="Seu nome">
              <mat-icon matSuffix>person</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>E-mail</mat-label>
              <input matInput type="email" formControlName="email" placeholder="seu@email.com">
              <mat-icon matSuffix>email</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Senha</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
              <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-hint>Mínimo 6 caracteres</mat-hint>
            </mat-form-field>

            <p class="error-msg" *ngIf="errorMsg">{{ errorMsg }}</p>

            <button mat-raised-button color="primary" class="full-width submit-btn"
                    type="submit" [disabled]="loading">
              <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
              <span *ngIf="!loading">Criar conta</span>
            </button>
          </form>

          <div class="divider"><span>ou</span></div>

          <button mat-stroked-button class="full-width google-btn" (click)="loginWithGoogle()">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="20">
            Cadastrar com Google
          </button>
        </mat-card-content>

        <mat-card-footer>
          <p class="register-link">
            Já tem conta? <a routerLink="/login">Entrar</a>
          </p>
        </mat-card-footer>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh; display: flex; align-items: center;
      justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    .auth-card { width: 100%; max-width: 420px; padding: 20px; border-radius: 16px; }
    .logo { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .logo mat-icon { font-size: 32px; width: 32px; height: 32px; color: #667eea; }
    .logo h1 { margin: 0; font-size: 28px; color: #333; }
    .subtitle { color: #666; margin: 0 0 24px; font-size: 14px; }
    .full-width { width: 100%; }
    .submit-btn { height: 48px; font-size: 16px; margin-top: 16px; }
    .divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; color: #999; font-size: 13px; }
    .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: #e0e0e0; }
    .google-btn { height: 48px; display: flex; align-items: center; gap: 10px; justify-content: center; }
    .register-link { text-align: center; margin-top: 16px; font-size: 14px; color: #666; }
    .register-link a { color: #667eea; font-weight: 500; text-decoration: none; }
    .error-msg { color: #f44336; font-size: 13px; margin: 4px 0; }
    mat-card-header { display: block; }
    mat-card-footer { display: block; }
  `]
})
export class Register {
  form: FormGroup;
  loading = false;
  hidePassword = true;
  errorMsg = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    this.auth.register(this.form.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: err => {
        this.errorMsg = err.error?.message || 'Erro ao criar conta';
        this.loading = false;
      }
    });
  }

  loginWithGoogle(): void {
    this.auth.loginWithGoogle();
  }
}