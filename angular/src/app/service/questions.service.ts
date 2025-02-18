import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private apiUrl = 'http://localhost:8080/api/questions'; // Adjust as needed
  
  constructor(private http: HttpClient) {}
  
  getAllUsers() {
    return this.http.get("http://localhost:8080/api/users");
  }
  // Get all group questions
  getAllGroupQuestions(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Get a specific group question by ID
  getGroupQuestionById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Create a new group question
  createGroupQuestion(groupQuestion: any): Observable<any> {
    return this.http.post(this.apiUrl, groupQuestion);
  }

  // Update a group question
  updateGroupQuestion(id: number, updatedGroup: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updatedGroup);
  }

  // Delete a group question
  deleteGroupQuestion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Add a user to a group question
  addUserToGroup(groupId: number, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${groupId}/add-user/${userId}`, {});
  }

  // Add a response to a group question
  addResponseToGroup(groupId: number, response: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${groupId}/add-response`, response);
  }
}