import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {ConsumeJsonGeneric, ConsumeJsonPage} from "../../models/consume/ConsumeJsonGeneric";

@Injectable({
  providedIn: 'root'
})
export class EstacionamientoService {
  baseURL = `${environment.backendURL}/est`;
  headers = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient) { }

  searchEstByParam(consume: ConsumeJsonPage): Observable<any> {
    return this.http.post<any>(
      `${this.baseURL}/searchEstByParam`,
      consume,
      { headers: this.headers }
    ).pipe();
  }
}
