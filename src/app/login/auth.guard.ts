import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.authService.isLoggedIn()){
      const userRole = this.authService.getRole();
      console.log(route.data['role']);
      if(!route.data['role']){
        return true;
      }
      else if(route.data['role'] === userRole || route.data['superUser'] === userRole){
        return true;
      }
    }
    this.router.navigate(['/auth/login'])
    return false;
  }
}
