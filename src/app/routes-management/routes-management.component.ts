import { Component, OnInit } from '@angular/core';
import {forkJoin, map, Observable, of, switchMap} from "rxjs";
import {Route} from "../shared/Route";
import {RoutesService} from "../services/routes.service";
import {CheckpointService} from "../services/checkpoint.service";
import {Checkpoint} from "../shared/Checkpoint";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../login/auth.service";
import {User} from "../shared/user";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {RoutesComponent} from "../routes/routes.component";

@Component({
  selector: 'app-routes-management',
  templateUrl: './routes-management.component.html',
  styleUrls: ['./routes-management.component.scss']
})
export class RoutesManagementComponent implements OnInit {

  routesList$: Observable<Route[]> = of();
  extendedRoutes$: Observable<any[]> = of();

  route: Route = {
    // @ts-ignore
    id: null,
    // @ts-ignore
    assignedUserId: null,
    pointA: '',
    pointB: '',
    // @ts-ignore
    startDate: null,
    // @ts-ignore
    endDate: null
  }

  closeResult = '';

  routeForm: FormGroup = new FormGroup({
    pointA: new FormControl(''),
    pointB: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    status: new FormControl('')
  });

  updateRoute: FormGroup = new FormGroup({
    assignedUserId: new FormControl(''),
    pointA: new FormControl(''),
    pointB: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    status: new FormControl('')
  });

  constructor(private routesService: RoutesService,
              private checkpointService: CheckpointService,
              private formBuilder: FormBuilder,
              public authService: AuthService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.routeForm = this.formBuilder.group({
      pointA: ['', [Validators.required]],
      pointB: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      status: ['', [Validators.required]]
    })
    this.loadRoutes();
    this.loadRoutesWithCheckpoints();
  }

  loadRoutes(): void {
    this.routesList$ = this.routesService.loadRoutes().pipe();
    console.log(this.routesList$);
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

  onSubmitCreateRoute() {
    this.routesService.createRoute(this.routeForm);
    window.location.reload();
  }

  deleteRoute(id: bigint){
    this.routesService.deleteRoute(id);
    window.location.reload();
  }

  open(content: any, route: Route) {
    this.route = route;

    this.updateRoute = this.formBuilder.group({
      assignedUserId: [this.route.assignedUserId, [Validators.required]],
      pointA: [this.route.pointA, [Validators.required]],
      pointB: [this.route.pointB, [Validators.required]],
      startDate: [this.route.startDate, [Validators.required]],
      endDate: [this.route.endDate, [Validators.required]],
      status: [this.route.status, [Validators.required]]
    })

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${RoutesManagementComponent.getDismissReason(reason)}`;
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
    this.routesService.updateRoute(this.route.id, this.updateRoute);
    window.location.reload();
  }

  isStarted(status: string): boolean{
    if(status == "Started"){
      return true;
    }
    return false;
  }
}
