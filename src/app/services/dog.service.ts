import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Dog } from '../models/dog.model';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DogService {
  private baseUrl = 'http://localhost:3000/api/dogs';

  constructor(private http: HttpClient, private router: Router) { }

  getDogListings(queryParams: any, headers: any): Observable<Dog[]> {
    const url = `${this.baseUrl}/`;
    console.log('Fetching dog listings from:', url);
    return this.http.get<Dog[]>(url, { params: queryParams, headers: headers })
      .pipe(
        tap((data: Dog[]) => {
          console.log('Received dog listings:', data);
        }),
        catchError((error: any) => {
          console.error('Error fetching dog listings:', error);
          return throwError('An error occurred while fetching dog listings.'); // Pass the error along
        })
      );
  }


  // getDogs(): Observable<Dog[]> {
  //   const token = localStorage.getItem('token');
  //   return this.http.get<Dog[]>(this.baseUrl, {
  //     headers: {
  //       'Authorization': `Bearer ${token}`,
  //       'Content-Type': 'application/json'
  //     }
  //   });
  // }

  getMyDogs(): Observable<Dog[]> {
    const token = localStorage.getItem('token');
    return this.http.get<Dog[]>(`${this.baseUrl}/my-dogs`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
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
        console.error('Error creating listing:', error);
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
    const token = localStorage.getItem('token');
    const url = `${this.baseUrl}/delete/${id}`;
    return this.http.delete<void>(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  updateDogInfo(dog: Dog): Observable<void> {
    const token = localStorage.getItem('token');
    const url = `${this.baseUrl}/edit/${dog.dogId}`;
    return this.http.put<void>(url, dog, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }
}