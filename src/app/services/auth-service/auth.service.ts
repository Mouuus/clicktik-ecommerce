import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private authToken: string | null = null;
  private APIURL=`${environment.apiUrl}/auth`;
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({
      username: username,
      password: password,
      expiresInMins: 30, // optional, defaults to 60
    });

    return this.http.post(`${this.APIURL}/login`, body,{headers}).pipe(
      tap((response: any) => {
        this.authToken = response.token;
        this.isLoggedIn = true;
        // Store the token in localStorage (or sessionStorage) if you want to persist the login state
        localStorage.setItem('authToken', this.authToken!);
      }),
      catchError((error) => {
        this.isLoggedIn = false;
        return of(error);
      })
    );
  }

  logout(): void {
    this.isLoggedIn = false;
    this.authToken = null;
    localStorage.removeItem('authToken');
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn || !!localStorage.getItem('authToken');
  }
}
