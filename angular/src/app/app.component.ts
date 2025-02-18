import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'jwt-angular';
  showSplash = true;

  ngOnInit() {
    // The splash screen will be hidden by the splash screen component itself
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt'); // Vérifie si un token existe dans le LocalStorage
  }
}
