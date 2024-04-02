import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(public userService: UserService) {}

  logout(): void {
    this.userService.logout();
  }

  ngOnInit(): void {
    console.log('Is user logged in?', this.userService.isLoggedIn());
  }
}