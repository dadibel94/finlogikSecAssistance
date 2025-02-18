import { Component, OnInit, AfterViewInit } from '@angular/core';
import { JwtService } from 'src/app/service/jwt.service';
import { Router } from '@angular/router';
import { ThemeService, ThemeType } from '../service/theme.service';
declare var bootstrap: any;

interface ThemeOption {
  id: ThemeType;
  nom: string;
  previewClass: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit {
  user: any = null;
  name: string = "";
  currentTheme: ThemeType;
  dropdowns: any[] = [];
  isUserMenuOpen = false;

  themes: ThemeOption[] = [
    { id: 'theme-bleu', nom: 'Bleu', previewClass: 'theme-bleu-preview' },
    { id: 'theme-violet', nom: 'Violet', previewClass: 'theme-violet-preview' },
    { id: 'theme-sombre', nom: 'Sombre', previewClass: 'theme-sombre-preview' }
  ];

  constructor(
    private jwtService: JwtService,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.currentTheme = this.themeService.currentTheme;
  }

  ngOnInit(): void {
    this.user = this.jwtService.getUserData();
    this.name = localStorage.getItem("name") || "";
    this.themeService.themeChanges.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  ngAfterViewInit(): void {
    // Initialize Bootstrap dropdowns
    const dropdownElements = document.querySelectorAll('[data-bs-toggle="dropdown"]');
    dropdownElements.forEach(element => {
      this.dropdowns.push(new bootstrap.Dropdown(element, {
        offset: [0, 10],
        popperConfig: {
          placement: 'bottom-end'
        }
      }));
    });
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  navigateToAccount(): void {
    this.isUserMenuOpen = false;
    this.router.navigate(['/account-details']);
  }

  changerTheme(theme: ThemeType) {
    this.themeService.setTheme(theme);
  }

  logout() {
    // Close all dropdowns before logout
    this.dropdowns.forEach(dropdown => dropdown.hide());
    this.isUserMenuOpen = false;
    localStorage.clear(); // Clear all localStorage data
    this.router.navigate(['/login']);
  }
}
