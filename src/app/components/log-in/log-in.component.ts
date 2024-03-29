import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
  credentials: any = {};
  errorMessage: string = '';

  constructor(private userService: UserService, private router: Router) {}

  login(): void {
    this.userService.login(this.credentials).subscribe(
      (response) => {
        console.log('User logged in successfully:', response);
        sessionStorage.setItem('currentUser', JSON.stringify(response.user));
        this.userService.redirectToWelcome();
        alert('You have been logged in!');
      },
      (error) => {
        console.error('Error logging in:', error);
        this.errorMessage = 'Invalid email or password';
      }
    );
  }
}