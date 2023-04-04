import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RegistrationComponent } from './registration.component';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [ RegistrationComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit registration form', () => {
    component.regForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      phone: '1234567890',
      gender: 'Male',
      role: 'Admin',
      password: 'password',
      address: '123 Main St'
    });

    component.onSubmit();

    const req = httpMock.expectOne('http://localhost:8080/api/v1/registration');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(component.regForm.value);

    req.flush({});
    expect(component.error).toBeFalse();
  });

  it('should handle registration form submission error', () => {
    component.regForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      phone: '1234567890',
      gender: 'Male',
      role: 'Admin',
      password: 'password',
      address: '123 Main St'
    });

    component.onSubmit();

    const req = httpMock.expectOne('http://localhost:8080/api/v1/registration');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(component.regForm.value);

    req.flush({}, { status: 500, statusText: 'Internal Server Error' });
    expect(component.error).toBeTrue();
  });
});
