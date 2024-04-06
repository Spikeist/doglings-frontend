import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient, private router: Router) { }

  signUp(user: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
      map(response => {
        if (response && response.userId) {
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('token', response.token);
          console.log('User ID:', response.userId);
        }
        return response;
      })
    );
  }

  redirectToWelcome(): void {
    this.router.navigate(['/welcome']);
  }

  getUser(id: string): Observable<User> {
    const url = `${this.baseUrl}/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(url);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.router.navigate(['/log-in']);
  }

  getUserInfo(queryParams:any): Observable<User>{
    const url = `${this.baseUrl}`;
    return this.http.get<User>(url, {params: queryParams})
    .pipe(
      tap((data: User) => {
        console.log('Received user info:', data);
      }),
      catchError((error: any) => {
        console.error('Error fetching user info:', error);
        return throwError('An error occurred while fetching user information.');
      })
    )
  }
}