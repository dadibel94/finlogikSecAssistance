import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from '../../service/jwt.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit {
  user: any = {};
  isEditing: boolean = false;
  editForm: FormGroup;
  availableTypes: string[] = ['QA', 'Dev', 'IA'];
  message: { text: string, type: 'success' | 'error' } | null = null;

  constructor(
    private jwtService: JwtService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      type: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.user = this.jwtService.getUserData();
    if (!this.user || !this.jwtService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.user.type) {
      this.user.type = localStorage.getItem('type');
    }
  }

  startEditing(): void {
    this.isEditing = true;
    this.editForm.patchValue({
      name: this.user.name,
      email: this.user.email,
      type: this.user.type
    });
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.message = null;
    this.editForm.reset();
  }

  saveChanges(): void {
    if (this.editForm.valid) {
      const updatedUser = {
        ...this.user,
        ...this.editForm.value
      };

      this.jwtService.updateUser(updatedUser).subscribe({
        next: (response) => {
          this.user = response;
          this.isEditing = false;
          this.message = { text: 'Profil mis à jour avec succès', type: 'success' };
          // Update stored user data
          localStorage.setItem('type', response.type);
        },
        error: (error) => {
          console.error('Update error:', error);
          this.message = { text: 'Erreur lors de la mise à jour du profil', type: 'error' };
        }
      });
    } else {
      this.message = { text: 'Veuillez corriger les erreurs du formulaire', type: 'error' };
    }
  }

  goBack(): void {
    const userRole = localStorage.getItem('role')?.toLowerCase();
    
    switch(userRole) {
      case 'superadmin':
        this.router.navigate(['/dashboardsuperadmin']);
        break;
      case 'admin':
        this.router.navigate(['/dashboardadmin']);
        break;
      default:
        this.router.navigate(['/dashboard']);
        break;
    }
  }
}
