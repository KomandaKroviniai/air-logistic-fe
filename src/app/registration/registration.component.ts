import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {UsersService} from "../services/users.service";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  regForm: FormGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    gender: new FormControl(''),
    role: new FormControl(''),
    password: new FormControl(''),
    address: new FormControl('')
  });

  error: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.regForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      gender: ['Gender', [Validators.required]],
      role: ['Select job type', [Validators.required]],
      password: ['', [Validators.required,
        Validators.pattern(RegExp('(?=.*[0-9])(?=.*[A-Z])'))]],
      address: ['']
    })
  }

  onSubmit() {
    this.http
      .post(
        'http://localhost:8080/api/v1/registration',
        this.regForm.value
      ).subscribe(() => {
        this.error = false;
        this.router.navigate(['/login'], {
          queryParams: {registered: 'success'},
        });
      },
      (error: HttpErrorResponse) => {
        this.error = true;
      });
  }
}
