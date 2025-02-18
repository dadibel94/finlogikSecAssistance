import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtService } from 'src/app/service/jwt.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup | undefined;
  userTypes: string[] = ['QA', 'Dev', 'IA']; // Liste des types d'utilisateurs

  constructor(
    private service: JwtService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      type: ['', [Validators.required]] // Nouveau champ obligatoire
    }, { validator: this.passwordMathValidator });
  }

  passwordMathValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    if (password != confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  submitForm() {
    if (this.registerForm.invalid) {
      alert("Veuillez remplir correctement le formulaire.");
      return;
    }

    // Enregistrer l'utilisateur
    this.service.register(this.registerForm.value).subscribe(
      (response) => {
        if (response.id != null) {
          // L'enregistrement a réussi, se connecter directement
          this.service.login({
            email: this.registerForm.value.email,
            password: this.registerForm.value.password
          }).subscribe(
            (loginResponse) => {
              if (loginResponse.jwt != null) {
                this.service.setUserData(response.name, loginResponse.jwt);
                localStorage.setItem('jwt', loginResponse.jwt);
                localStorage.setItem('role', loginResponse.role);
                localStorage.setItem('name', response.name);
                localStorage.setItem('type', this.registerForm.value.type); // Stockage du type

                // Redirection vers le tableau de bord approprié
                const targetRoute = loginResponse.role && loginResponse.role.toLowerCase() === 'admin'
                  ? "/dashboardadmin"
                  : "/dashboard";

                this.router.navigateByUrl(targetRoute).then(() => {
                  window.location.reload();
                });

                alert(`Bienvenue ${response.name} (${this.registerForm.value.type})`);
              }
            },
            (loginError) => {
              console.error("Erreur de connexion après inscription", loginError);
              alert("Échec de la connexion. Veuillez réessayer.");
            }
          );
        }
      },
      (error) => {
        console.error("Erreur lors de l'enregistrement", error);
        alert("Échec de l'enregistrement. Veuillez réessayer.");
      }
    );
  }
}
