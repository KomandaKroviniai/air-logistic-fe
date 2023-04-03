import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../shared/user";
import {FormGroup} from "@angular/forms";
import {Route} from "../shared/Route";
import {DiagramData} from "../shared/DiagramData";

@Injectable({
  providedIn: 'root',
})
export class DiagramService{

  constructor(private httpClient: HttpClient) {
  }

  private routesUrl = new URL('http://localhost:8080/api/v1/routes/');

  loadData(): Observable<DiagramData[]>{
    return this.httpClient.get<DiagramData[]>(this.routesUrl.href + "statuscount");
  }
}
