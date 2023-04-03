import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Checkpoint} from "../shared/Checkpoint";
import {Observable} from "rxjs";
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root',
})
export class CheckpointService{
  constructor(private httpClient: HttpClient) {
  }

  private checkpointsUrl = new URL('http://localhost:8080/api/v1/checkpoints/');

  loadCheckpoints(): Observable<Checkpoint[]>{
console.warn(this.checkpointsUrl.href);
    return this.httpClient.get<Checkpoint[]>(this.checkpointsUrl.href);
  }

  loadCheckpointsByRouteId(routeId: bigint) {
    console.warn(this.checkpointsUrl.href + routeId);
    return this.httpClient.get<Checkpoint[]>(this.checkpointsUrl.href + routeId);
  }

  createCheckpoint(checkpointForm: FormGroup){
    this.httpClient.post(this.checkpointsUrl.href, checkpointForm.value).subscribe();
  }

  updateCheckpoint(id: bigint, updateForm: FormGroup){
    this.httpClient.put<any>(this.checkpointsUrl.href + id, updateForm.value).subscribe();
  }

  deleteCheckpoints(id: bigint){
    this.httpClient.delete(this.checkpointsUrl.href + id).subscribe();
  }
}
