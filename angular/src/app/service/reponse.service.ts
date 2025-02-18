import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnswerService {
  private apiUrl = 'http://localhost:8080/answers'; // Adjust as needed

  constructor(private http: HttpClient) {}

  // Get all answers
  getAnswers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Get answers by question ID
  getAnswersByQuestion(questionId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/question/${questionId}`);
  }

  // Add an answer to a question
  addAnswer(questionId: number, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${questionId}`, data);
  }

  // Delete an answer
  deleteAnswer(answerId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${answerId}`);
  }
}
