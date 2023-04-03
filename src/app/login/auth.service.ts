import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'http://localhost:8080/authenticate';

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('auth');
    this._isLoggedIn$.next(!!token);
  }

  private helper = new JwtHelperService();
  private rawToken = localStorage.getItem('auth');
  private role = localStorage.getItem('role');
  private converted: string[] = ["email","role","firstName","lastName"];
  private firstName: string = '';
  private lastName: string = '';

  public isLoggedIn(): boolean{
    return this._isLoggedIn$.value;
  }

  login(userData: any): Observable<any> {
    return this.http.post(this.url, userData).pipe(
      tap((response: any) => {
        this._isLoggedIn$.next(true);
        this.rawToken = response.token;
        localStorage.setItem('auth', response.token);
        this.converted = (this.helper.decodeToken(this.rawToken!).sub).split("|");
        localStorage.setItem('role', this.converted[1]);
        localStorage.setItem('firstName', this.converted[2]);
        localStorage.setItem('lastName', this.converted[3]);
        localStorage.setItem('id', this.converted[4]);
      })
    );
  }

  public logout(): void {
    this.router.navigate(['/login'], {
      queryParams: {loggedOut: 'success'},
    }).then(r =>{
      this._isLoggedIn$.next(false);
      localStorage.removeItem('auth');
      localStorage.removeItem('role');
      localStorage.removeItem('firstName');
      localStorage.removeItem('lastName');
      localStorage.removeItem('id');
    });
  }

  getEmail(): string {
    if(this.isLoggedIn()){
      this.rawToken = localStorage.getItem('auth');
      this.converted = (this.helper.decodeToken(this.rawToken!).sub).split("|");
      return this.converted[0];
    }
    return "";
  }

  getRole(): string {
    if(this.isLoggedIn()){
      // @ts-ignore
      return this.role;
    }
    return "";
  }

  public isManager(): boolean {
    if(this.isLoggedIn() && (this.role === 'Manager' || this.role === 'Admin')){
      return true;
    }
    return false;
  }

  public isUser(): boolean {
    if(this.isLoggedIn() && (this.role === 'Driver' || this.role === 'Admin')){
      return true;
    }
    return false;
  }

  getFirstAndLastName(): string {
    this.converted = (this.helper.decodeToken(this.rawToken!).sub).split("|");
    localStorage.setItem('firstName', this.converted[2]);
    localStorage.setItem('lastName', this.converted[3]);
    return localStorage.getItem('firstName') + " " + localStorage.getItem('lastName');
  }
}
