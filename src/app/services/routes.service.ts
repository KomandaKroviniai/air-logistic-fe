import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../shared/user";
import {FormGroup} from "@angular/forms";
import {Route} from "../shared/Route";

@Injectable({
  providedIn: 'root',
})
export class RoutesService{

  constructor(private httpClient: HttpClient) {
  }

  private routesUrl = new URL('http://localhost:8080/api/v1/routes/');

  loadRoutes(): Observable<Route[]>{

    return this.httpClient.get<Route[]>(this.routesUrl.href);
  }

  loadRoutesByAssignedUserId(): Observable<Route[]>{
    return this.httpClient.get<Route[]>(this.routesUrl.href + localStorage.getItem('id'));
  }
  loadRoutesByAssignedUserIdIsEmpty(): Observable<Route[]>{
    return this.httpClient.get<Route[]>(this.routesUrl.href + "notassigned");
  }

  deleteRoute(id: bigint){
    this.httpClient.delete(this.routesUrl.href + id).subscribe();
  }

  updateRoute(id: bigint, updateForm: FormGroup){
    this.httpClient.put<any>(this.routesUrl.href + id, updateForm.value).subscribe();
  }

  createRoute(routeForm: FormGroup){
    this.httpClient.post(this.routesUrl.href, routeForm.value).subscribe();
  }

  assignRoute(id: bigint, userId: string) {
    this.httpClient.get(this.routesUrl.href + "assign/" + id + "/" + userId).subscribe();
  }

  unassignRoute(id: bigint) {
    this.httpClient.get(this.routesUrl.href + "unassign/" + id).subscribe();
  }
}
