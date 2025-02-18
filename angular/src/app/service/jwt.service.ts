import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const BASE_URL = "http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(private http: HttpClient) { }

  register(signRequest: any): Observable<any> {
    return this.http.post(BASE_URL + 'signup', signRequest);
  }

  login(loginRequest: any): Observable<any> {
    console.info(loginRequest);
    return this.http.post(BASE_URL + 'login', loginRequest);
  }

  hello(): Observable<any> {
    return this.http.get(BASE_URL + 'api/hello', {
      headers: this.createAuthorizationHeader()
    });
  }

  private createAuthorizationHeader(): HttpHeaders {
    const jwtToken = localStorage.getItem('jwt');
    return jwtToken ? new HttpHeaders().set("Authorization", "Bearer " + jwtToken) : new HttpHeaders();
  }

  // ✅ Stocker les infos de l'utilisateur connecté
  setUserData(user: any, token: string) {
    localStorage.setItem('jwt', token);
    localStorage.setItem('user', JSON.stringify(user)); // Stocke l'utilisateur complet
  }

  // ✅ Récupérer les infos de l'utilisateur connecté
  getUserData() {
    const user = localStorage.getItem('user');
    console.log("getUserData"+user);
    return user ? JSON.parse(user) : null;
  }

  getToken(){
    return localStorage.getItem('jwt') ?? null;
  }

  // ✅ Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return localStorage.getItem('jwt') !== null;
  }

  // ✅ Déconnexion
  logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('user');
    localStorage.removeItem('type');
  }

  updateUser(userData: any): Observable<any> {
    return this.http.put(BASE_URL + "user/update", userData, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      tap((response: any) => {
        if (response) {
          // Update stored user data while keeping the JWT token
          const token = localStorage.getItem('jwt');
          this.setUserData(response, token || '');
        }
      })
    );
  }

  getIp(): Observable<any> {
    return this.http.get('https://api.ipify.org?format=json');
  }


  blockUser(userId: number, duration: number): Observable<any> {
    return this.http.post(`${BASE_URL}/block`, { userId, duration });
  }

  unblockUser(userId: number): Observable<any> {
    return this.http.post(`${BASE_URL}/unblock`, { userId });
  }
}
