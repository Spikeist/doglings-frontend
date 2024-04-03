import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Dog } from 'src/app/models/dog.model';
import { DogService } from 'src/app/services/dog.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-listings',
  templateUrl: './my-listings.component.html',
  styleUrls: ['./my-listings.component.css']
})
export class MyListingsComponent {
  unsoldDogs: Dog[] = [];
  soldDogs: Dog[] = [];
  dog: Dog = {
    dogId: 0,
    name: '',
    price: 0,
    gender: '',
    image: '',
    breed: '',
    age: 0,
    sold: false,
    userId: ''
  };

  constructor(private router: Router, private dogService: DogService, private userService: UserService) { }

  redirectToCreateListing(): void {
    this.router.navigate(['/create-listing']);
  }

  ngOnInit(): void {
    this.loadDogs();
  }

  loadDogs(): void {
    if (this.userService.isLoggedIn()) {
      const userId = localStorage.getItem('userId');
      console.log('User ID:', userId); // Add this line to log userId
      if (userId) {
        this.dogService.getDogs(userId).subscribe(
          (dogs: Dog[]) => {
            console.log('Dogs:', dogs); // Add this line to log fetched dogs
            this.unsoldDogs = dogs.filter(dog => !dog.sold);
            this.soldDogs = dogs.filter(dog => dog.sold);
          },
          error => {
            console.error('Error fetching dogs:', error);
          }
        );
      }
    }
  }

  editDog(dogId: number): void {
    this.router.navigate(['/edit-listing', dogId.toString()]);
  }

  deleteDog(id: number): void {
    const dogId = id.toString();
    this.dogService.deleteDogListing(dogId).subscribe(
      () => {
        console.log('Dog listing deleted successfully');
        this.loadDogs();
      },
      error => {
        console.error('Error deleting dog listing:', error);
      }
    );
  }

  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }
}