import { AuthService } from './auth.service';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

describe('AuthService', () => {
  let authService: AuthService;
  let http: HttpClient;
  let router: Router;
  beforeEach(() => {
    authService = new AuthService(http, router); // Pass in null for HttpClient and Router since they are not used in this test
  });

  it('should return true if user is logged in and has the role "Admin"', () => {
    authService['_isLoggedIn$'].next(true); // Set isLoggedIn to true
    authService['role'] = 'Admin'; // Set the role to 'Admin'

    const isSuperUser = authService.isSuperUser();

    expect(isSuperUser).toBeTrue();
  });

  it('should return false if user is not logged in', () => {
    authService['_isLoggedIn$'].next(false); // Set isLoggedIn to false
    authService['role'] = 'Admin'; // Set the role to 'Admin'

    const isSuperUser = authService.isSuperUser();

    expect(isSuperUser).toBeFalse();
  });

  it('should return false if user is logged in but does not have the role "Admin"', () => {
    authService['_isLoggedIn$'].next(true); // Set isLoggedIn to true
    authService['role'] = 'User'; // Set the role to 'User'

    const isSuperUser = authService.isSuperUser();

    expect(isSuperUser).toBeFalse();
  });
});
