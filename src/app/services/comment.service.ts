import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Checkpoint} from "../shared/Checkpoint";
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root',
})
export class CommentService{
  constructor(private httpClient: HttpClient) {
  }

  private commentUrl = new URL('http://localhost:8080/api/v1/comments/');

  loadComment(): Observable<Comment[]>{
    console.warn(this.commentUrl.href);
    return this.httpClient.get<Comment[]>(this.commentUrl.href);
  }

  loadCommentByForumId(forumId: number): Observable<Comment[]>{
    console.warn(this.commentUrl.href + forumId);
    return this.httpClient.get<Comment[]>(this.commentUrl.href + forumId);
  }

  createComment(forumId: bigint, commentForm: FormGroup){
    this.httpClient.post(this.commentUrl.href, commentForm.value).subscribe();
  }

  deleteComment(commentId: bigint){
    this.httpClient.delete(this.commentUrl.href + commentId).subscribe();
  }
}
