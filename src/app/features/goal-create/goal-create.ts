import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { GoalService } from '../../core/services/goal.service';

@Component({
  selector: 'app-goal-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatDatepickerModule, MatNativeDateModule,
    MatProgressSpinnerModule, MatToolbarModule],
  template: `
    <div class="page">
      <mat-toolbar class="toolbar">
        <button mat-icon-button routerLink="/dashboard">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span class="toolbar-title">Nova Meta</span>
      </mat-toolbar>

      <div class="content">
        <mat-card class="form-card">
          <mat-card-header>
            <div class="card-header">
              <mat-icon class="header-icon">emoji_events</mat-icon>
              <div>
                <h2>Crie sua nova meta</h2>
                <p>A IA vai gerar 3 missões diárias para te ajudar a conquistá-la</p>
              </div>
            </div>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Qual é a sua meta?</mat-label>
                <input matInput formControlName="title"
                       placeholder="Ex: Ler um livro por mês, Aprender inglês...">
                <mat-icon matSuffix>flag</mat-icon>
                <mat-hint>Seja específico sobre o que deseja alcançar</mat-hint>
                <mat-error *ngIf="form.get('title')?.hasError('required')">
                  Título é obrigatório
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Observações (opcional)</mat-label>
                <textarea matInput formControlName="notes" rows="3"
                          placeholder="Contexto adicional, motivação, detalhes..."></textarea>
                <mat-icon matSuffix>notes</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Data limite</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="targetDate"
                       placeholder="Quando quer conquistar essa meta?">
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
                <mat-error *ngIf="form.get('targetDate')?.hasError('required')">
                  Data limite é obrigatória
                </mat-error>
              </mat-form-field>

              <div class="ai-info">
                <mat-icon>auto_awesome</mat-icon>
                <p>Após criar, nossa IA vai gerar automaticamente <strong>3 missões diárias</strong> personalizadas para sua meta!</p>
              </div>

              <p class="error-msg" *ngIf="errorMsg">{{ errorMsg }}</p>

              <div class="actions">
                <button mat-stroked-button type="button" routerLink="/dashboard">
                  Cancelar
                </button>
                <button mat-raised-button color="primary" type="submit" [disabled]="loading">
                  <mat-spinner diameter="20" *ngIf="loading"></mat-spinner>
                  <mat-icon *ngIf="!loading">auto_awesome</mat-icon>
                  <span>{{ loading ? 'Gerando missões...' : 'Criar Meta' }}</span>
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .page { min-height: 100vh; background: #f5f5f5; }
    .toolbar { background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .toolbar-title { font-size: 18px; font-weight: 600; margin-left: 8px; }
    .content { max-width: 640px; margin: 0 auto; padding: 32px 16px; }
    .form-card { border-radius: 16px; padding: 8px; }
    .card-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
    .header-icon { font-size: 40px; width: 40px; height: 40px; color: #667eea; }
    .card-header h2 { margin: 0; font-size: 20px; color: #333; }
    .card-header p { margin: 4px 0 0; font-size: 13px; color: #888; }
    .full-width { width: 100%; margin-bottom: 8px; }
    .ai-info { display: flex; align-items: flex-start; gap: 10px; background: #f0f4ff;
               border-radius: 8px; padding: 14px; margin: 16px 0; }
    .ai-info mat-icon { color: #667eea; flex-shrink: 0; }
    .ai-info p { margin: 0; font-size: 13px; color: #555; line-height: 1.5; }
    .actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 16px; }
    .actions button { min-width: 140px; height: 44px; }
    .error-msg { color: #f44336; font-size: 13px; margin: 8px 0; }
    mat-card-header { display: block; }
  `]
})
export class GoalCreate {
  form: FormGroup;
  loading = false;
  errorMsg = '';
  minDate = new Date();

  constructor(private fb: FormBuilder, private goalService: GoalService, private router: Router) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      notes: [''],
      targetDate: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';

    const value = this.form.value;
    const date = new Date(value.targetDate);
    const formatted = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;

    this.goalService.create({ ...value, targetDate: formatted }).subscribe({
      next: goal => this.router.navigate(['/goals', goal.id]),
      error: err => {
        this.errorMsg = err.error?.message || 'Erro ao criar meta';
        this.loading = false;
      }
    });
  }
}