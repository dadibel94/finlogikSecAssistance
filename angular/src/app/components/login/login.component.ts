import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/service/jwt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;  // Correction : pas besoin de "| undefined"

  constructor(
    private service: JwtService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

  }

  submitForm() {
    if (this.loginForm.invalid) {
      alert("Veuillez remplir correctement le formulaire.");
      return;
    }

    this.service.login(this.loginForm.value).subscribe(
      (response) => {
        console.log(response);

        if (response.jwt != null && response) {
          // ✅ Stocker toutes les infos dans le LocalStorage

          let user = response.user;
          console.log("User "+user);

          this.service.setUserData(user.name, response.jwt);

          // alert("Connexion réussie, bienvenue " + user.name);

          localStorage.setItem('jwt', response.jwt);
          localStorage.setItem('role', user.role);
          localStorage.setItem('name', user.name);
          localStorage.setItem('email', user.email);
          localStorage.setItem('user', JSON.stringify(user));


          // Redirection selon le rôle
          const targetRoute = user.role && user.role.toLowerCase() === 'admin'
            ? "/dashboardadmin"
            : "/dashboard";

          this.router.navigateByUrl(targetRoute).then(() => {
            window.location.reload(); // ✅ Rafraîchir après la navigation réussie
          });
        }
      },
      (error) => {
        console.error("Erreur de connexion", error);
        alert("Échec de la connexion. Veuillez vérifier vos identifiants.");
      }
    );
  }

}
