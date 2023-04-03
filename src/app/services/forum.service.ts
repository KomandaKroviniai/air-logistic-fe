import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Checkpoint} from "../shared/Checkpoint";
import {Forum} from "../shared/Forum";
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root',
})
export class ForumService{
  constructor(private httpClient: HttpClient) {
  }

  private forumUrl = new URL('http://localhost:8080/api/v1/forum/');

  loadForum(): Observable<Forum[]>{
    console.warn(this.forumUrl.href);
    return this.httpClient.get<Forum[]>(this.forumUrl.href);
  }

  createForum(forumForm: FormGroup){
    this.httpClient.post(this.forumUrl.href, forumForm.value).subscribe();
  }

  deleteForum(forumId: bigint){
    this.httpClient.delete(this.forumUrl.href + forumId).subscribe();
  }
}
