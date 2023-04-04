import { Component, OnInit } from '@angular/core';
import {Observable, of} from "rxjs";
import {Checkpoint} from "../shared/Checkpoint";
import {CheckpointService} from "../services/checkpoint.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../login/auth.service";
import {User} from "../shared/user";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-checkpoints',
  templateUrl: './checkpoints.component.html',
  styleUrls: ['./checkpoints.component.scss']
})
export class CheckpointsComponent implements OnInit {
  checkpointsList$: Observable<Checkpoint[]> = of();

  checkpointForm: FormGroup = new FormGroup({
    routeId: new FormControl(''),
    description: new FormControl(''),
    date: new FormControl(null)
  });

  checkpoint: Checkpoint = {
    // @ts-ignore
    id: null,
    // @ts-ignore
    routeId: null,
    description: '',
    // @ts-ignore
    date: null
  }

  closeResult = '';

  updateCheckpoint: FormGroup = new FormGroup({
    routeId: new FormControl(''),
    description: new FormControl(''),
    date: new FormControl('')
  });

  constructor(private modalService: NgbModal,
              private checkpointService: CheckpointService,
              private formBuilder: FormBuilder,
              public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadCheckpoints();
    this.checkpointForm = this.formBuilder.group({
      routeId: ['', [Validators.required]],
      description: ['', [Validators.required]],
      date: ['', [Validators.required]]
    })
  }

  loadCheckpoints(): void {
    this.checkpointsList$ = this.checkpointService.loadCheckpoints().pipe();
  }

  onSubmitCreateCheckpoint() {
    this.checkpointService.createCheckpoint(this.checkpointForm);
    window.location.reload();
  }

  onSubmit() {
    this.checkpointService.updateCheckpoint(this.checkpoint.id, this.updateCheckpoint);
    window.location.reload();
  }

  deleteCheckpoint(id: bigint) {
    this.checkpointService.deleteCheckpoints(id);
    window.location.reload();
  }

  open(content: any, checkpoint: Checkpoint) {
    this.checkpoint = checkpoint;

    this.updateCheckpoint = this.formBuilder.group({
      routeId: [this.checkpoint.routeId, [Validators.required]],
      description: [this.checkpoint.description, [Validators.required]],
      date: [this.checkpoint.date, [Validators.required]]
    })

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${CheckpointsComponent.getDismissReason(reason)}`;
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
}
