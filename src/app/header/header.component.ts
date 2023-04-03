import { Component, OnInit } from '@angular/core';
import {AuthService} from "../login/auth.service";
import {Router} from "@angular/router";
import {JwtHelperService} from "@auth0/angular-jwt";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) { }

  private helper = new JwtHelperService();
  private rawToken = localStorage.getItem('auth');

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.logout();
  }

  getEmail(): string {
    return this.authService.getEmail();
  }

  getRole(): string {
    return this.authService.getRole();
  }
}
