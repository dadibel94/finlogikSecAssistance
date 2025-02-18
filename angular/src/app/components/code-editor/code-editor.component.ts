import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ThemeService } from '../../service/theme.service';

interface LanguageOption {
  id: string;
  name: string;
  mode: string;
}

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss']
})
export class CodeEditorComponent implements OnInit {
  content = '// Écrivez votre code ici';
  currentLanguage = 'java';
  isDarkTheme = false;

  languages: LanguageOption[] = [
    { id: 'java', name: 'Java', mode: 'text/x-java' },
    { id: 'python', name: 'Python', mode: 'text/x-python' }
  ];

  options = {
    lineNumbers: true,
    theme: 'material',
    mode: 'text/x-java',
    autoCloseBrackets: true,
    matchBrackets: true,
    indentUnit: 4,
    tabSize: 4,
    lineWrapping: true,
    styleActiveLine: true,
    viewportMargin: Infinity,
    extraKeys: {
      'Ctrl-Space': 'autocomplete'
    }
  };

  constructor(
    private http: HttpClient,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    // Synchroniser le thème avec le thème global de l'application
    this.themeService.themeChanges.subscribe(theme => {
      this.isDarkTheme = theme === 'theme-sombre';
      this.updateEditorTheme();
    });
  }

  changeLanguage(languageId: string) {
    const language = this.languages.find(lang => lang.id === languageId);
    if (language) {
      this.currentLanguage = languageId;
      this.options = {
        ...this.options,
        mode: language.mode
      };
    }
  }

  private updateEditorTheme() {
    this.options = {
      ...this.options,
      theme: this.isDarkTheme ? 'material-darker' : 'material'
    };
  }

  analyzeCode() {
    const codeToAnalyze = this.content;

    // Exemple d'appel HTTP vers SonarQube (assurez-vous d'adapter l'URL et les headers selon votre configuration)
    const sonarqubeApiUrl = 'https://votre-instance-sonarqube/api/your-endpoint';  // Remplacez par l'URL de votre instance SonarQube et l'endpoint approprié
    const payload = {
      code: codeToAnalyze,
      // D'autres paramètres si nécessaires
    };

    this.http.post(sonarqubeApiUrl, payload).subscribe(response => {
      console.log('Réponse SonarQube:', response);
      alert('Analyse du code envoyée avec succès!');
    }, error => {
      console.error('Erreur d\'analyse du code:', error);
      alert('Une erreur est survenue lors de l\'analyse du code.');
    });
  }
}
