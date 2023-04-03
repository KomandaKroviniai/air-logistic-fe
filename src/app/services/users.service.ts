import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../shared/user";
import {Injectable} from "@angular/core";
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root',
})
export class UsersService{
  constructor(private httpClient: HttpClient) {
  }

  private usersUrl = new URL('http://localhost:8080/api/v1/users/');
  private regUrl = new URL('http://localhost:8080/api/v1/registration');

  loadUsers(): Observable<User[]>{

    return this.httpClient.get<User[]>(this.usersUrl.href);
  }

  deleteUser(id: bigint){
    this.httpClient.delete(this.usersUrl.href + id).subscribe();
  }

  updateUser(id: bigint, updateForm: FormGroup){
    this.httpClient.put<any>(this.usersUrl.href + id, updateForm.value).subscribe();
  }

  createUser(regForm: FormGroup){
    this.httpClient.post(this.regUrl.href, regForm.value).subscribe();
  }
}
