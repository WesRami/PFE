import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('LoginComponent initialisé');
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token with /users/me
      this.http.get('http://localhost:8080/users/me', {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      }).subscribe({
        next: () => {
          console.log('Token valide, redirection vers /dashboard');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Token invalide : ', err);
          localStorage.removeItem('token');
          console.log('Token supprimé, reste sur /login');
        }
      });
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs manquants',
        text: 'Veuillez remplir tous les champs correctement.',
        confirmButtonColor: '#007bff'
      });
      return;
    }

    const loginData = this.loginForm.value;
    console.log('Envoi de la requête login : ', loginData);
    this.http.post('http://localhost:8080/users/login_admin', loginData).subscribe({
      next: (response: any) => {
        console.log('Réponse complète : ', JSON.stringify(response, null, 2));
        console.log('Clé access_token : ', response.access_token);
        const token = response.access_token;
        if (!token) {
          console.error('Aucun token reçu');
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Aucun token reçu du serveur.',
            confirmButtonColor: '#007bff'
          });
          return;
        }
        localStorage.setItem('token', token);
        console.log('Connexion réussie, stockage du token');
        Swal.fire({
          icon: 'success',
          title: 'Connexion réussie',
          text: 'Vous êtes connecté !',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          console.log('Redirection vers /dashboard');
          this.router.navigate(['/dashboard']).then(success => {
            console.log('Navigation vers dashboard réussie : ', success);
          });
        });
      },
      error: (err) => {
        console.error('Erreur lors de la connexion : ', err);
        let errorMessage = 'Échec de la connexion. Vérifiez vos identifiants.';
        if (err.error?.message) {
          errorMessage = err.error.message;
        }
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: errorMessage,
          confirmButtonColor: '#007bff'
        });
      }
    });
  }
}