import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: string;
  job?: string;
  birthday?: string;
  number?: string;
  image?: string;
}

interface UserUpdateDto {
  firstname?: string;
  lastname?: string;
  email?: string;
  role?: string;
  job?: string;
  birthday?: string;
  number?: string;
  image?: string;
}

interface PageResponse<T> {
  content: T[];
  pageable: any;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: any;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

@Component({
  selector: 'app-collaborators',
  templateUrl: './collaborators.component.html',
  styleUrls: ['./collaborators.component.css']
})
export class CollaboratorsComponent implements OnInit {
  userForm: FormGroup;
  users: User[] = [];
  isFormVisible = false;
  isLoading = false;
  isEditing = false;
  editingUserId: number | null = null;
  showPasswordField = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      role: ['Collaborateur', Validators.required],
      job: [''],
      birthday: [''],
      number: [''],
      image: ['']
    });
  }

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      Swal.fire({
        icon: 'warning',
        title: 'Accès refusé',
        text: 'Veuillez vous connecter pour accéder à cette page.',
        confirmButtonColor: '#007bff'
      });
      this.router.navigate(['/login']);
      return;
    }
    this.loadUsers();
    setTimeout(() => {
      this.isFormVisible = true;
    }, 100);
  }

  loadUsers(): void {
    this.isLoading = true;
    // Fetch all users with a large page size
    this.http.get<PageResponse<User>>('http://localhost:8080/users?page=0&size=1000').subscribe({
      next: (response) => {
        this.users = response.content;
        this.isLoading = false;
        console.log('Utilisateurs chargés : ', response.content);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erreur lors du chargement des utilisateurs : ', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: err.error || 'Impossible de charger les utilisateurs.',
          confirmButtonColor: '#007bff'
        });
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs manquants',
        text: 'Veuillez remplir tous les champs obligatoires correctement.',
        confirmButtonColor: '#007bff'
      });
      return;
    }

    this.isLoading = true;
    const userData = this.userForm.value;

    if (this.isEditing && this.editingUserId) {
      const updateData: UserUpdateDto = {
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        role: userData.role,
        job: userData.job || null,
        birthday: userData.birthday || null,
        number: userData.number || null,
        image: userData.image || null
      };

      this.http.patch(`http://localhost:8080/users/${this.editingUserId}`, updateData).subscribe({
        next: () => {
          this.isLoading = false;
          Swal.fire({
            icon: 'success',
            title: 'Collaborateur modifié',
            text: 'Le collaborateur a été modifié avec succès.',
            confirmButtonColor: '#007bff'
          }).then(() => {
            this.resetForm();
            this.loadUsers();
          });
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Erreur lors de la mise à jour du collaborateur : ', err);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: err.error || 'Impossible de modifier le collaborateur.',
            confirmButtonColor: '#007bff'
          });
        }
      });
    } else {
      const registerData: RegisterRequest = {
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        job: userData.job || null,
        birthday: userData.birthday || null,
        number: userData.number || null,
        image: userData.image || null
      };

      this.http.post('http://localhost:8080/users/add', registerData).subscribe({
        next: () => {
          this.isLoading = false;
          Swal.fire({
            icon: 'success',
            title: 'Collaborateur ajouté',
            text: 'Le collaborateur a été ajouté avec succès.',
            confirmButtonColor: '#007bff'
          }).then(() => {
            this.resetForm();
            this.loadUsers();
          });
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Erreur lors de l’ajout du collaborateur : ', err);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: err.error || 'Impossible d’ajouter le collaborateur. Vérifiez l’email.',
            confirmButtonColor: '#007bff'
          });
        }
      });
    }
  }

  editUser(user: User): void {
    this.isEditing = true;
    this.editingUserId = user.id;
    this.userForm.patchValue({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      password: '',
      job: '',
      birthday: '',
      number: '',
      image: ''
    });
  }

  resetForm(): void {
    this.userForm.reset({
      role: 'Collaborateur',
      password: '',
      job: '',
      birthday: '',
      number: '',
      image: ''
    });
    this.isEditing = false;
    this.editingUserId = null;
  }

  deleteUser(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Vous ne pourrez pas annuler cette action !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.http.delete(`http://localhost:8080/users/${id}`).subscribe({
          next: () => {
            this.isLoading = false;
            Swal.fire({
              icon: 'success',
              title: 'Supprimé',
              text: 'Le collaborateur a été supprimé.',
              confirmButtonColor: '#007bff'
            }).then(() => {
              this.loadUsers();
            });
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Erreur lors de la suppression du collaborateur : ', err);
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: err.error || 'Impossible de supprimer le collaborateur.',
              confirmButtonColor: '#007bff'
            });
          }
        });
      }
    });
  }
}