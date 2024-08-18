import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private authToken: string | null = null;
  private APIURL=`${environment.apiUrl}/auth`;
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  public loggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkLoginStatus();
  }

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
    localStorage.removeItem('authToken');
    this.loggedInSubject.next(false);
  }

  private checkLoginStatus(): void {
    const token = localStorage.getItem('authToken');
    this.loggedInSubject.next(!!token);
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn || !!localStorage.getItem('authToken');
  }

  
}
