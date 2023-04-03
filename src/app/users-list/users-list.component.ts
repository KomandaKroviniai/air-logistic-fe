import { Component, OnInit } from '@angular/core';
import {Observable, of} from "rxjs";
import {User} from "../shared/user";
import {UsersService} from "../services/users.service";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../login/auth.service";

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  usersList$: Observable<User[]> = of();
  user: User = {
    id: BigInt(0),
    firstName: '',
    lastName: '',
    gender: '',
    phone: '',
    email: '',
    password: '',
    role: '',
    address: ''
  };
  closeResult = '';

  updateForm: FormGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    gender: new FormControl(''),
    role: new FormControl(''),
    password: new FormControl(''),
    address: new FormControl('')
  });

  constructor(private modalService: NgbModal,
              private usersService: UsersService,
              private formBuilder: FormBuilder,
              public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersList$ = this.usersService.loadUsers().pipe();
  }

  open(content: any, user: User) {
    this.user = user;

    this.updateForm = this.formBuilder.group({
      firstName: [this.user.firstName, [Validators.required]],
      lastName: [this.user.lastName, [Validators.required]],
      email: [this.user.email, [Validators.required]],
      phone: [this.user.phone, [Validators.required]],
      gender: [this.user.gender, [Validators.required]],
      role: [this.user.role, [Validators.required]],
      password: [this.user.password, [Validators.required]],
      address: [this.user.address, [Validators.required]]
    })

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${UsersListComponent.getDismissReason(reason)}`;
    });
  }

  private static getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSubmit() {
    this.usersService.updateUser(this.user.id, this.updateForm);
    window.location.reload();
  }

  deleteUser(id: bigint){
    this.usersService.deleteUser(id);
    window.location.reload();
  }

}
