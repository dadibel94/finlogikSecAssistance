import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogService {
  private apiUrl = 'http://localhost:8080/logs'; // Adjust based on your backend URL

  constructor(private http: HttpClient) {}

  // Fetch logs for a specific user
  getLogsByUser(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${email}`);
  }

  // Log an action (if needed)
  logAction(message: string, email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { message, email });
  }

  logEvent(message: string): Observable<any> {
    return this.http.post(this.apiUrl, { logMessage: message });
  }
}
