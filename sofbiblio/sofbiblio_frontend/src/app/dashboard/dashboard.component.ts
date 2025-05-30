import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { Chart } from 'chart.js/auto';
import { Router } from '@angular/router';

interface DashboardStats {
  collaboratorCount: number;
  activeUsers: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  stats: DashboardStats = {
    collaboratorCount: 0,
    activeUsers: 0
  };
  
  isStatsVisible = false;
  isLoading = false;
  
  // Données pour le graphique (adapté aux collaborateurs)
  chartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Nouveaux collaborateurs',
        data: [5, 7, 2, 8, 4, 6],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      },
      {
        label: 'Connexions',
        data: [50, 70, 20, 80, 40, 60],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };
  
  // Statistiques mensuelles (adapté aux collaborateurs)
  monthlyStats = {
    currentMonth: {
      users: 8,
      logins: 156
    },
    previousMonth: {
      users: 5,
      logins: 132
    }
  };
  
  // Actions rapides pour les collaborateurs
  quickActions = [
    { name: 'Nouvel utilisateur', icon: 'fa-user-plus', route: '/collaborators', action: 'addCollaborator', color: 'success' },
    { name: 'Liste collaborateurs', icon: 'fa-users', route: '/collaborators', color: 'warning' }
  ];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
    
    // Animation d'entrée décalée
    setTimeout(() => {
      this.isStatsVisible = true;
    }, 100);
  }
  
  ngAfterViewInit() {
    this.initChart();
  }

  initChart() {
    const ctx = document.getElementById('statsChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: this.chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  loadStats(): void {
    this.isLoading = true;
    
    // Requêtes pour les collaborateurs uniquement
    forkJoin({
      collaborators: this.http.get<number>('http://localhost:8080/users/countCollaborateur').pipe(
        catchError(() => {
          this.showError('Impossible de charger le nombre de collaborateurs.');
          return of(0);
        })
      ),
      activeUsers: this.http.get<number>('http://localhost:8080/users/active').pipe(
        catchError(() => of(0))
      )
    }).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe(results => {
      this.stats.collaboratorCount = results.collaborators;
      this.stats.activeUsers = results.activeUsers;
    });
  }
  
  showError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: message,
      confirmButtonColor: '#007bff'
    });
  }
  
  refreshStats(): void {
    this.loadStats();
    Swal.fire({
      icon: 'info',
      title: 'Actualisation',
      text: 'Actualisation des données en cours...',
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }
  
  calculateGrowth(current: number, previous: number): number {
    if (previous === 0) return 100;
    return Math.round(((current - previous) / previous) * 100);
  }
  
  // Gérer les actions rapides
  handleQuickAction(action: string): void {
    if (action === 'addCollaborator') {
      this.router.navigate(['/collaborators']).then(() => {
        localStorage.setItem('showCollaboratorForm', 'true');
      });
    }
  }
  
  // Nouvelle méthode pour gérer le clic sur "Voir l'Activité"
  showActivityInfo(): void {
    Swal.fire({
      icon: 'info',
      title: 'Activité des utilisateurs',
      text: 'Détails des connexions et des activités récentes des utilisateurs.',
      confirmButtonColor: '#007bff'
    });
  }
}