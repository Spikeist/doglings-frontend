import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  formData: any = {};

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    const inputs = document.querySelectorAll<HTMLInputElement>(".input-field");

    inputs.forEach((inp) => {
      inp.addEventListener("focus", ()=> {
        inp.classList.add("active");
      });
      inp.addEventListener("blur", () => {
        if(inp.value != "") return;
        inp.classList.remove("active")
      })
    });
  }

  signUp(): void {
    this.userService.signUp(this.formData).subscribe(
      response => {
        console.log('User signed up successfully:', response);
        this.userService.redirectToWelcome();
        alert('You have been signed up!');
      },
      error => {
        console.error('Error signing up:', error);
      }
    );
  }
}

