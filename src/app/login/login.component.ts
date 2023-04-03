import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {User} from "../shared/user";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  isLoginFailed = false;
  infoMessage = '';
  constructor(private authService: AuthService,
              private router: Router,
              private activatedRouter: ActivatedRoute,
              private formBuilder: FormBuilder,
              private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  login() {
    this.authService.login(this.loginForm.value).subscribe(
      (token) => {
          this.router.navigate(['/forum'], {
            queryParams: {loggedin: 'success'},
          }).then(() => {
            window.location.reload();
          });
      },
      () => {
        this.isLoginFailed = true;
      }
    );
  }

  // isMedPaz(): string{
  //   return this.httpClient.get<Boolean>(this.usersUrl.href);
  // }

}
