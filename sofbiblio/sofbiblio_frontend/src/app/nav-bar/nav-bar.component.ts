import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  constructor(private router: Router) {}

  logout(): void {
    Swal.fire({
      title: 'Déconnexion',
      text: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, déconnexion',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        // Supprimer le token JWT
        localStorage.removeItem('accessToken');
        // Rediriger vers la page de login
        this.router.navigate(['/login']);
        Swal.fire({
          icon: 'success',
          title: 'Déconnexion',
          text: 'Vous êtes déconnecté.',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }
}