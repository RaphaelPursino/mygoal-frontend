import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GoalService } from '../../core/services/goal.service';
import { AuthService } from '../../core/services/auth.service';
import { Goal } from '../../core/models/goal.model';
import { User } from '../../core/models/auth.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule,
    MatIconModule, MatProgressBarModule, MatToolbarModule,
    MatMenuModule, MatProgressSpinnerModule],
  template: `
    <div class="page">
      <!-- Toolbar -->
      <mat-toolbar class="toolbar">
        <div class="toolbar-left">
          <mat-icon class="logo-icon">flag</mat-icon>
          <span class="logo-text">MyGoal</span>
        </div>
        <div class="toolbar-right">
          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
            <div class="user-info-menu">
              <p class="user-name">{{ user?.name }}</p>
              <p class="user-email">{{ user?.email }}</p>
            </div>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Sair</span>
            </button>
          </mat-menu>
        </div>
      </mat-toolbar>

      <div class="content">
        <div class="header-section">
          <div>
            <h2>Olá, {{ getUserFirstName() }}! 👋</h2>
            <p class="header-sub">Aqui estão suas metas ativas</p>
          </div>
          <button mat-raised-button color="primary" routerLink="/goals/new" class="new-btn">
            Nova Meta
          </button>
        </div>

        <!-- Loading -->
        <div class="loading" *ngIf="loading">
          <mat-spinner diameter="48"></mat-spinner>
        </div>

        <!-- Empty state -->
        <div class="empty-state" *ngIf="!loading && goals.length === 0">
          <mat-icon>emoji_flags</mat-icon>
          <h3>Nenhuma meta ainda</h3>
          <p>Crie sua primeira meta e deixe a IA te ajudar a conquistá-la!</p>
          <button mat-raised-button color="primary" routerLink="/goals/new">
            + Criar minha primeira meta
          </button>
        </div>

        <!-- Goals grid -->
        <div class="goals-grid" *ngIf="!loading && goals.length > 0">
          <mat-card class="goal-card" *ngFor="let goal of goals; trackBy: trackById">
            <mat-card-header>
              <div class="goal-header">
                <span class="goal-chip status-{{ goal.status.toLowerCase() }}">
                  {{ getStatusLabel(goal.status) }}
                </span>
                <span class="goal-date">
                  <mat-icon style="font-size:14px;width:14px;height:14px">calendar_today</mat-icon>
                  {{ formatDate(goal.targetDate) }}
                </span>
              </div>
            </mat-card-header>

            <mat-card-content>
              <h3 class="goal-title">{{ goal.title }}</h3>
              <p class="goal-notes" *ngIf="goal.notes">{{ goal.notes }}</p>

              <div class="progress-section">
                <div class="progress-header">
                  <span>Progresso</span>
                  <span class="progress-pct">{{ goal.progressPercentage }}%</span>
                </div>
                <mat-progress-bar
                  mode="determinate"
                  [value]="goal.progressPercentage"
                  color="primary">
                </mat-progress-bar>
              </div>

              <div class="missions-today"
                   *ngIf="goal.todayMissions && goal.todayMissions.length > 0">
                <p class="missions-label">Missões de hoje:</p>
                <div class="mission-item" *ngFor="let m of goal.todayMissions">
                  <mat-icon [style.color]="m.completed ? '#4caf50' : '#9e9e9e'"
                            style="font-size:18px;width:18px;height:18px">
                    {{ m.completed ? 'check_circle' : 'radio_button_unchecked' }}
                  </mat-icon>
                  <span [class.completed-text]="m.completed">{{ m.title }}</span>
                </div>
              </div>
            </mat-card-content>

            <mat-card-actions>
              <button mat-button color="primary" (click)="openGoal(goal.id)">
                Ver detalhes
              </button>
              <button mat-button color="warn" (click)="deleteGoal(goal.id, $event)">
                <mat-icon>delete</mat-icon>
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { min-height: 100vh; background: #f5f5f5; }
    .toolbar { background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
               display: flex; justify-content: space-between; }
    .toolbar-left { display: flex; align-items: center; gap: 8px; }
    .logo-icon { color: #667eea; }
    .logo-text { font-size: 20px; font-weight: 600; color: #333; }
    .content { max-width: 1100px; margin: 0 auto; padding: 32px 16px; }
    .header-section { display: flex; justify-content: space-between;
                      align-items: center; margin-bottom: 32px; }
    .header-section h2 { font-size: 24px; color: #333; margin: 0; }
    .header-sub { color: #666; margin: 4px 0 0; }
    .new-btn { border-radius: 24px; }
    .loading { display: flex; justify-content: center; padding: 64px; }
    .empty-state { text-align: center; padding: 80px 20px; }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px;
                             color: #ccc; margin-bottom: 16px; display: block; }
    .empty-state h3 { font-size: 22px; color: #555; margin-bottom: 8px; }
    .empty-state p { color: #888; margin-bottom: 24px; }
    .goals-grid { display: grid;
                  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
    .goal-card { border-radius: 12px; transition: transform .2s, box-shadow .2s; }
    .goal-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
    .goal-header { display: flex; justify-content: space-between;
                   align-items: center; width: 100%; margin-bottom: 8px; }
    .goal-chip { font-size: 11px; padding: 4px 10px; border-radius: 12px; font-weight: 500; }
    .status-active { background: #e3f2fd; color: #1565c0; }
    .status-completed { background: #e8f5e9; color: #2e7d32; }
    .status-abandoned { background: #fce4ec; color: #c62828; }
    .goal-date { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #888; }
    .goal-title { font-size: 18px; font-weight: 600; color: #333; margin: 0 0 8px; }
    .goal-notes { font-size: 13px; color: #777; margin-bottom: 16px;
                  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .progress-section { margin: 12px 0; }
    .progress-header { display: flex; justify-content: space-between;
                       font-size: 13px; color: #666; margin-bottom: 6px; }
    .progress-pct { font-weight: 600; color: #667eea; }
    .missions-today { margin-top: 16px; }
    .missions-label { font-size: 12px; color: #888; margin-bottom: 8px;
                      text-transform: uppercase; }
    .mission-item { display: flex; align-items: center; gap: 8px;
                    margin-bottom: 6px; font-size: 13px; color: #555; }
    .completed-text { text-decoration: line-through; color: #aaa; }
    .user-info-menu { padding: 12px 16px; border-bottom: 1px solid #eee; margin-bottom: 4px; }
    .user-name { font-weight: 600; color: #333; margin: 0; }
    .user-email { font-size: 12px; color: #888; margin: 2px 0 0; }
  `]
})
export class Dashboard implements OnInit {
  goals: Goal[] = [];
  loading = true;
  user: User | null = null;

  constructor(
    private goalService: GoalService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(u => this.user = u);
    this.loadGoals();
  }

  loadGoals(): void {
    this.loading = true;
    this.goalService.list().subscribe({
      next: goals => {
        this.goals = goals.map(g => ({
          ...g,
          todayMissions: g.todayMissions ?? []
        }));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openGoal(id: string): void {
    this.router.navigate(['/goals', id]);
  }

  deleteGoal(id: string, event: Event): void {
    event.stopPropagation();
    if (!confirm('Tem certeza que deseja excluir esta meta?')) return;
    this.goalService.delete(id).subscribe({
      next: () => {
        this.goals = [...this.goals.filter(g => g.id !== id)];
        this.cdr.detectChanges();
      },
      error: err => console.error('Erro ao excluir:', err)
    });
  }

  getUserFirstName(): string {
    return this.user?.name?.split(' ')[0] || '';
  }

  trackById(index: number, goal: Goal): string {
    return goal.id;
  }

  logout(): void {
    this.authService.logout();
  }

  getStatusLabel(status: string): string {
    const labels: any = { ACTIVE: 'Ativa', COMPLETED: 'Concluída', ABANDONED: 'Abandonada' };
    return labels[status] || status;
  }

  formatDate(date: string): string {
    return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR');
  }
}