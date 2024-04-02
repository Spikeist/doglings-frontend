import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DogService } from 'src/app/services/dog.service';

@Component({
  selector: 'app-create-listing',
  templateUrl: './create-listing.component.html',
  styleUrls: ['./create-listing.component.css']
})
export class CreateListingComponent {
  formData: any = {};
  selectedFile: File | null = null;

  constructor(private router: Router, private dogService: DogService) { }

  submitListing(): void {
    console.log('Form Data:', this.formData);

    let formData = new FormData();

    console.log('Name:', this.formData.name);
    console.log('Breed:', this.formData.breed);
    console.log('Age:', this.formData.age);
    console.log('Price:', this.formData.price);
    console.log('Gender:', this.formData.gender);
    console.log('Image:', this.formData.image);
    console.log('Allergies:', this.formData.allergies);
    console.log('Disability:', this.formData.disability);

    if (!this.formData.allergies) {
      this.formData.allergies = "none";
    }
    this.formData.disability = !!this.formData.disability;

    console.log(this.formData);
    console.log('Allergies:', this.formData.allergies);
    console.log('Disability:', this.formData.disability);

    console.log('FormData:', this.formData);

    this.dogService.createDogListing(this.formData).subscribe(
      response => {
        console.log('Listing created successfully:', response);
        this.dogService.redirectToMyListings();
        alert('Listing created successfully!');
      },
      error => {
        console.error('Error creating listing:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    this.formData.image = event.target.value;
  }
}