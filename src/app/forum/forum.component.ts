import { Component, OnInit } from '@angular/core';
import {forkJoin, map, merge, mergeMap, Observable, of, scan, switchMap} from "rxjs";
import {Forum} from "../shared/Forum";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ForumService} from "../services/forum.service";
import {CommentService} from "../services/comment.service";
import {User} from "../shared/user";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../login/auth.service";

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

  forumList$: Observable<Forum[]> = of();

  extendedForum$: Observable<any[]> = of();

  closeResult = '';

  forum: any[] = {
    // @ts-ignore
    id: null,
    title: '',
    body: '',
    createdBy: ''
  }


  comment: any[] = {
    // @ts-ignore
    id: null,
    comment: '',
    forumId: null,
    createdBy: ''
  }

  forumForm: FormGroup = new FormGroup({
    title: new FormControl(''),
    body: new FormControl(''),
    createdBy: new FormControl('')
  });

  commentForm: FormGroup = new FormGroup({
    comment: new FormControl(''),
    createdBy: new FormControl('')
  });

  constructor(private modalService: NgbModal,
              private forumService: ForumService,
              private commentService: CommentService,
              private formBuilder: FormBuilder,
              public authService: AuthService) { }

  ngOnInit(): void {
    this.forumForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      body: ['', [Validators.required]],
      createdBy: ['']
    })
    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required]],
      forumId: [null],
      createdBy: ['']
    })
    this.loadForumWithComments();
  }

  loadForum(): void{
    this.forumList$ = this.forumService.loadForum().pipe();
    console.log(this.forumList$);
  }

  loadForumWithComments(): void{
    this.extendedForum$ = this.forumService.loadForum().pipe(
      switchMap(forum => {
        return forkJoin(forum.map(forum => {
          return this.commentService.loadCommentByForumId(forum.id).pipe(
            map(comment => ({ ...forum, comment: comment })),
          );
        }));
      }),
    );

    console.log(this.extendedForum$.pipe());
  }

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${ForumComponent.getDismissReason(reason)}`;
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
    this.forumForm.patchValue({createdBy: this.authService.getFirstAndLastName()});
    this.forumService.createForum(this.forumForm);
    window.location.reload();
  }

  createComment(forumId: bigint){
    this.commentForm.patchValue({forumId: forumId});
    this.commentForm.patchValue({createdBy: this.authService.getFirstAndLastName()});
    this.commentService.createComment(forumId, this.commentForm);
    window.location.reload();
  }

}
