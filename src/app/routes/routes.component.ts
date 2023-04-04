import { Component, OnInit } from '@angular/core';
import {AuthService} from "../login/auth.service";
import {forkJoin, map, Observable, of, switchMap} from "rxjs";
import {Route} from "../shared/Route";
import {Checkpoint} from "../shared/Checkpoint";
import {CheckpointService} from "../services/checkpoint.service";
import {RoutesService} from "../services/routes.service";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss']
})
export class RoutesComponent implements OnInit {

  routesList$: Observable<Route[]> = of();
  notAssignedRoutesList$: Observable<Route[]> = of();
  extendedRoutes$: Observable<any[]> = of();

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
  routeId: string = "";

  updateCheckpoint: FormGroup = new FormGroup({
    routeId: new FormControl(''),
    description: new FormControl(''),
    date: new FormControl('')
  });

  checkpointForm: FormGroup = new FormGroup({
    routeId: new FormControl(''),
    description: new FormControl(''),
    date: new FormControl(null)
  });

  constructor(public authService: AuthService,
              private checkpointService: CheckpointService,
              private routesService: RoutesService,
              private modalService: NgbModal,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loadRoutes();
    this.loadNotAssignedRoutes();
    this.loadRoutesWithCheckpoints();
  }

  loadRoutes(): void {
    this.routesList$ = this.routesService.loadRoutesByAssignedUserId().pipe();
    console.log(this.routesList$);
  }

  loadNotAssignedRoutes(): void {
    this.notAssignedRoutesList$ = this.routesService.loadRoutesByAssignedUserIdIsEmpty().pipe();
    console.log(this.notAssignedRoutesList$);
  }

  loadRoutesWithCheckpoints(): void {
    this.extendedRoutes$ = this.routesList$.pipe(
      switchMap(route => {
        return forkJoin(route.map(route => {
          return this.checkpointService.loadCheckpointsByRouteId(route.id).pipe(
            map(checkpoint => ({ ...route, checkpoint: checkpoint })),
          );
        }));
      }),
    );

    console.log(this.extendedRoutes$.pipe());
  }

  assignRoute(id: bigint) {
    // @ts-ignore
    this.routesService.assignRoute(id, localStorage.getItem('id'));
    this.reloadPage();
  }

  unassignRoute(id: bigint) {

    this.routesService.unassignRoute(id);
    this.reloadPage();
  }

  reloadPage(){
    window.location.reload();
  }

  open(content: any, checkpoint: Checkpoint) {
    this.checkpoint = checkpoint;

    this.updateCheckpoint = this.formBuilder.group({
      routeId: [this.checkpoint.routeId, [Validators.required]],
      description: [this.checkpoint.description, [Validators.required]],
      date: [this.checkpoint.date, [Validators.required]]
    });

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${RoutesComponent.getDismissReason(reason)}`;
    });
  }

  openCreateCheckpoint(content: any, routeId: string) {
    this.routeId = routeId;

    this.checkpointForm = this.formBuilder.group({
      routeId: [''],
      description: ['', [Validators.required]],
      date: ['', [Validators.required]]
    });

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${RoutesComponent.getDismissReason(reason)}`;
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
    this.checkpointService.updateCheckpoint(this.checkpoint.id, this.updateCheckpoint);
    window.location.reload();
  }

  isStartedOrCompleted(status: string): boolean{
    return status == "Completed" || status == "Started";

  }

  isStarted(status: string): boolean{
    return status == "Started";

  }

  onSubmitCreateCheckpoint() {
    this.checkpointForm.controls['routeId'].setValue(
      this.routeId
    );

    this.checkpointService.createCheckpoint(this.checkpointForm);
    window.location.reload();
  }
}
