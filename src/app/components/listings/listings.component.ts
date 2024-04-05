import { Component, OnInit } from '@angular/core';
import { DogService } from 'src/app/services/dog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css']
})
export class ListingsComponent implements OnInit {
  data: any[] = [];
  breeds: string[] = [];
  dogs: any[] = [];
  filteredBreeds: string[] = [];
  filteredDogs: { [key: string]: any[] } = {};
  breedFilter: string = '';
  genderFilter: string = '';
  minPrice: number = 0;
  maxPrice: number = 8000;

  constructor(private dogService: DogService, private router: Router) { }

  ngOnInit(): void {
    this.fetchDogListings();
  }

  fetchDogListings(): void {
    let queryParams: { [key: string]: string } = {};
  
    if (this.breedFilter) {
      queryParams['breed'] = this.breedFilter;
    }
    if (this.genderFilter) {
      queryParams['gender'] = this.genderFilter;
    }
    if (this.maxPrice) {
      queryParams['maxPrice'] = this.maxPrice.toString();
    }
  
    const token = localStorage.getItem('token');
    
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
    console.log('Fetching dog listings with query params:', queryParams);

    this.dogService.getDogListings(queryParams, headers).subscribe(
      (data: any) => {
        console.log('Fetched dog listings:', data);
        this.dogs = data;
        this.extractBreeds();
        this.applyFilter();
      },
      (error: any) => {
        console.error('Error fetching dog listings:', error);
      }
    );
  }

  extractBreeds(): void {
    this.breeds = Array.from(new Set(this.dogs.map(dog => dog.breed)));
  }

  applyFilter(): void {
    console.log('Applying filter. Breed:', this.breedFilter, 'Gender:', this.genderFilter, 'Max Price:', this.maxPrice);
    this.filteredBreeds = this.breeds.filter(breed =>
      breed.toLowerCase().includes(this.breedFilter.toLowerCase())
    );

    this.filteredDogs = {};
    for (const breed of this.filteredBreeds) {
      this.filteredDogs[breed] = this.dogs.filter(dog =>
        dog.breed === breed &&
        (this.genderFilter === '' || dog.gender === this.genderFilter) &&
        (this.maxPrice === 0 || dog.price <= this.maxPrice)
      );
    }
    console.log('Filtered breeds:', this.filteredBreeds, 'Filtered dogs:', this.filteredDogs);
  }
}