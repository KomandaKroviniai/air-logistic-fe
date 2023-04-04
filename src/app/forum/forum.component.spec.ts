import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ForumComponent } from './forum.component';
import { ForumService } from '../services/forum.service';
import { CommentService } from '../services/comment.service';
import { AuthService } from '../login/auth.service';
import { FormBuilder } from '@angular/forms';

describe('ForumComponent', () => {
  let component: ForumComponent;
  let fixture: ComponentFixture<ForumComponent>;
  let forumServiceStub: Partial<ForumService>;
  let commentServiceStub: Partial<CommentService>;
  let authServiceStub: Partial<AuthService>;

  beforeEach(async(() => {
    forumServiceStub = {
      loadForum: () => of([{ id: 1, title: 'Test Forum', body: 'Test body', createdBy: 'Test User' }])
    };

    commentServiceStub = {
      loadCommentByForumId: (forumId: number) => of([{ id: 1, comment: 'Test Comment', forumId: forumId, createdBy: 'Test User' }])
    };

    authServiceStub = {
      getFirstAndLastName: () => 'Test User'
    };

    TestBed.configureTestingModule({
      declarations: [ ForumComponent ],
      providers: [
        FormBuilder,
        { provide: ForumService, useValue: forumServiceStub },
        { provide: CommentService, useValue: commentServiceStub },
        { provide: AuthService, useValue: authServiceStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load forum list', () => {
    component.loadForum();
    expect(component.forumList$).toBeDefined();
  });

  it('should load forum with comments', () => {
    component.loadForumWithComments();
    expect(component.extendedForum$).toBeDefined();
  });

  it('should create forum', () => {
    spyOn(component.forumService, 'createForum').and.callThrough();
    component.onSubmit();
    expect(component.forumService.createForum).toHaveBeenCalled();
  });

  it('should create comment', () => {
    spyOn(component.commentService, 'createComment').and.callThrough();
    component.createComment(1);
    expect(component.commentService.createComment).toHaveBeenCalled();
  });
});
