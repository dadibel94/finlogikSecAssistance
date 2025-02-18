import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeType = 'theme-bleu' | 'theme-violet' | 'theme-sombre';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeKey = 'app-theme';
  private currentThemeSubject = new BehaviorSubject<ThemeType>(this.getStoredTheme());

  constructor() {
    this.applyTheme(this.currentTheme);
  }

  get currentTheme(): ThemeType {
    return this.currentThemeSubject.value;
  }

  get themeChanges() {
    return this.currentThemeSubject.asObservable();
  }

  private getStoredTheme(): ThemeType {
    return (localStorage.getItem(this.themeKey) as ThemeType) || 'theme-bleu';
  }

  setTheme(theme: ThemeType) {
    localStorage.setItem(this.themeKey, theme);
    this.currentThemeSubject.next(theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: ThemeType) {
    // Supprimer tous les thèmes existants
    document.body.classList.remove('theme-bleu', 'theme-violet', 'theme-sombre');
    // Appliquer le nouveau thème
    document.body.classList.add(theme);
  }
}
