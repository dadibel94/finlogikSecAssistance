import { Component } from '@angular/core';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent {
  question: string = '';
  answers: string[] = [];

  dummyData = {
    'authentification': [
      'Utilisez JWT pour gérer les sessions.',
      'Spring Security est recommandé pour Java.'
    ],
    'database': [
      'Utilisez PostgreSQL pour de meilleures performances.',
      'Les indexes accélèrent les requêtes SQL.'
    ]
  };

  searchAnswers() {
    this.answers = this.dummyData['authentification'] || ['Aucune réponse trouvée.'];
  }
}
