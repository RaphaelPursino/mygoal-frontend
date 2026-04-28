import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GoalService } from '../../core/services/goal.service';
import { Goal, Mission } from '../../core/models/goal.model';

@Component({
  selector: 'app-goal-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule,
    MatIconModule, MatProgressBarModule, MatToolbarModule,
    MatProgressSpinnerModule],
  template: `
    <div class="page">
      <mat-toolbar class="toolbar">
        <button mat-icon-button routerLink="/dashboard">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span class="toolbar-title">Detalhe da Meta</span>
      </mat-toolbar>

      <div class="loading" *ngIf="loading">
        <mat-spinner diameter="48"></mat-spinner>
        <p>Carregando...</p>
      </div>

      <div class="empty-state" *ngIf="!loading && !goal">
        <p>Meta não encontrada.</p>
        <a routerLink="/dashboard">Voltar ao dashboard</a>
      </div>

      <div class="content" *ngIf="!loading && goal">
        <mat-card class="goal-header-card">
          <div class="goal-top">
            <span class="status-chip status-{{ goal.status.toLowerCase() }}">
              {{ getStatusLabel(goal.status) }}
            </span>
            <h2 class="goal-title">{{ goal.title }}</h2>
            <p class="goal-notes" *ngIf="goal.notes">{{ goal.notes }}</p>
            <p class="goal-date">
              <mat-icon>calendar_today</mat-icon>
              Prazo: {{ formatDate(goal.targetDate) }}
            </p>
          </div>

          <div class="progress-section">
            <div class="progress-info">
              <span>Progresso geral</span>
              <span class="progress-pct">{{ goal.progressPercentage }}%</span>
            </div>
            <mat-progress-bar
              mode="determinate"
              [value]="goal.progressPercentage"
              color="primary"
              class="progress-bar">
            </mat-progress-bar>
            <p class="progress-sub">
              {{ goal.completedMissions }} de {{ goal.totalMissions }} missões concluídas
            </p>
          </div>

          <div class="completed-banner" *ngIf="goal.status === 'COMPLETED'">
            <mat-icon>emoji_events</mat-icon>
            <span>Parabéns! Você conquistou essa meta! 🎉</span>
          </div>
        </mat-card>

        <div class="missions-section">
          <h3 class="section-title">
            <mat-icon>today</mat-icon>
            Missões de Hoje
          </h3>

          <div *ngIf="goal.todayMissions.length === 0" class="no-missions">
            <mat-icon>hourglass_empty</mat-icon>
            <p>Nenhuma missão para hoje ainda.</p>
          </div>

          <mat-card class="mission-card"
                    *ngFor="let mission of goal.todayMissions"
                    [class.mission-done]="mission.completed"
                    [class.mission-pending]="isPastMission(mission)">
            <div class="mission-content">
              <div class="mission-icon">
                <mat-icon [style.color]="mission.completed ? '#4caf50' : isPastMission(mission) ? '#ff9800' : '#667eea'">
                  {{ mission.completed ? 'check_circle' : isPastMission(mission) ? 'warning' : 'radio_button_unchecked' }}
                </mat-icon>
              </div>
              <div class="mission-text">
                <div class="mission-date-badge" *ngIf="isPastMission(mission)">
                  📅 Pendente de {{ formatDate(mission.missionDate) }}
                </div>
                <h4 [class.done-title]="mission.completed">{{ mission.title }}</h4>
                <p>{{ mission.description }}</p>
                <span class="completed-time" *ngIf="mission.completedAt">
                  ✓ Concluída às {{ formatTime(mission.completedAt) }}
                </span>
              </div>
              <button mat-raised-button color="primary"
                      *ngIf="!mission.completed && goal.status === 'ACTIVE'"
                      (click)="completeMission(mission.id)"
                      [disabled]="completing === mission.id"
                      class="complete-btn">
                <mat-spinner diameter="16" *ngIf="completing === mission.id"></mat-spinner>
                <span *ngIf="completing !== mission.id">Concluir</span>
              </button>
            </div>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { min-height: 100vh; background: #f5f5f5; }
    .toolbar { background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .toolbar-title { font-size: 18px; font-weight: 600; margin-left: 8px; }
    .content { max-width: 720px; margin: 0 auto; padding: 32px 16px; }
    .loading { display: flex; flex-direction: column; align-items: center;
               justify-content: center; padding: 64px; gap: 16px; color: #666; }
    .empty-state { text-align: center; padding: 64px; color: #888; }
    .goal-header-card { border-radius: 16px; padding: 8px; margin-bottom: 24px; }
    .goal-top { margin-bottom: 20px; }
    .status-chip { font-size: 11px; padding: 4px 12px; border-radius: 12px; font-weight: 500; }
    .status-active { background: #e3f2fd; color: #1565c0; }
    .status-completed { background: #e8f5e9; color: #2e7d32; }
    .goal-title { font-size: 24px; font-weight: 700; color: #333; margin: 12px 0 8px; }
    .goal-notes { color: #777; font-size: 14px; margin-bottom: 8px; }
    .goal-date { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #888; }
    .goal-date mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .progress-section { background: #f8f9ff; border-radius: 12px; padding: 16px; margin-top: 8px; }
    .progress-info { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: #555; }
    .progress-pct { font-size: 20px; font-weight: 700; color: #667eea; }
    .progress-bar { height: 12px; border-radius: 6px; }
    .progress-sub { font-size: 12px; color: #888; margin-top: 8px; }
    .completed-banner { display: flex; align-items: center; gap: 10px; background: #e8f5e9;
                        border-radius: 10px; padding: 14px; margin-top: 16px; color: #2e7d32; font-weight: 500; }
    .completed-banner mat-icon { color: #f9a825; }
    .missions-section { }
    .section-title { display: flex; align-items: center; gap: 8px; font-size: 18px;
                     color: #333; margin-bottom: 16px; }
    .section-title mat-icon { color: #667eea; }
    .no-missions { text-align: center; padding: 32px; color: #888; }
    .no-missions mat-icon { font-size: 40px; width: 40px; height: 40px; display: block; margin: 0 auto 8px; }
    .mission-card { border-radius: 12px; margin-bottom: 12px; }
    .mission-done { opacity: 0.75; background: #fafafa; }
    .mission-content { display: flex; align-items: flex-start; gap: 16px; padding: 4px; }
    .mission-icon mat-icon { font-size: 28px; width: 28px; height: 28px; margin-top: 4px; }
    .mission-text { flex: 1; }
    .mission-text h4 { margin: 0 0 4px; font-size: 16px; color: #333; }
    .done-title { text-decoration: line-through; color: #aaa; }
    .mission-text p { margin: 0; font-size: 13px; color: #777; line-height: 1.5; }
    .completed-time { font-size: 12px; color: #4caf50; margin-top: 6px; display: block; }
    .complete-btn { min-width: 100px; flex-shrink: 0; }
    .mission-pending { border-left: 4px solid #ff9800 !important; }
    .mission-date-badge { font-size: 11px; color: #ff9800; font-weight: 600; margin-bottom: 4px; }
  `]
})
export class GoalDetail implements OnInit {
  goal: Goal | null = null;
  loading = true;
  completing: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private goalService: GoalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadGoal(id);
    } else {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  loadGoal(id: string): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.goalService.getById(id).subscribe({
      next: goal => {
        this.goal = {
          ...goal,
          todayMissions: goal.todayMissions ?? []
        };
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Erro ao carregar meta:', err);
        this.goal = null;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  completeMission(missionId: string): void {
    this.completing = missionId;
    this.cdr.detectChanges();
    this.goalService.completeMission(missionId).subscribe({
      next: () => {
        this.completing = null;
        const id = this.route.snapshot.paramMap.get('id')!;
        this.loadGoal(id);
      },
      error: err => {
        console.error('Erro ao concluir missão:', err);
        this.completing = null;
        this.cdr.detectChanges();
      }
    });
  }

  getStatusLabel(status: string): string {
    const labels: any = { ACTIVE: 'Ativa', COMPLETED: 'Concluída', ABANDONED: 'Abandonada' };
    return labels[status] || status;
  }

  formatDate(date: string): string {
    return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR');
  }

  formatTime(dt: string): string {
    return new Date(dt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  isPastMission(mission: Mission): boolean {
    const today = new Date().toISOString().split('T')[0];
    return mission.missionDate < today && !mission.completed;
  }
}