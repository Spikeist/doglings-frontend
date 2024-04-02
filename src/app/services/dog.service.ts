import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Dog } from '../models/dog.model';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DogService {
  private baseUrl = 'http://localhost:3000/api/dogs';

  constructor(private http: HttpClient, private router: Router) { }

  getDogListings(): Observable<Dog[]> {
    return this.http.get<Dog[]>(`${this.baseUrl}/`);
  }

  getDogs(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  createDogListing(formData: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post<any>(
      `${this.baseUrl}/post-listing`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error creating listing:', error); // Add this line to log the error
        if (error.status === 400) {
          if (error.error && error.error.errors) {
            const validationErrors = error.error.errors.map((err: any) => err.message);
            return throwError(validationErrors);
          }
        }
        return throwError('An error occurred while creating the dog listing.');
      })
    );
  }

  redirectToMyListings(): void {
    this.router.navigate(['/my-listings']);
  }

  getRandomDogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/`);
  }

  getDogInfo(id: string): Observable<Dog> {
    return this.http.get<Dog>(`${this.baseUrl}/${id}`);
  }

  deleteDogListing(id: string): Observable<void> {
    const url = `${this.baseUrl}/delete/:id${id}`;
    return this.http.delete<void>(url);
  }

  updateDogInfo(dog: Dog): Observable<void> {
    const url = `${this.baseUrl}/edit/${dog.dogId}`;
    return this.http.put<void>(url, dog);
  }
}