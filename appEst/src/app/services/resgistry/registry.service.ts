import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ConsumeJsonGeneric} from "../../models/consume/ConsumeJsonGeneric";

@Injectable({
  providedIn: 'root'
})
export class RegistryService {
  baseURL = `${environment.backendURL}/registry`;
  headers = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient) { }

  setNewRegistryByToken(consume: ConsumeJsonGeneric): Observable<any> {
    return this.http.post<any>(
      `${this.baseURL}/createOrUpdateRegistry`,
      consume,
      { headers: this.headers }
    ).pipe();
  }

  findRegistryByToken(consume: ConsumeJsonGeneric): Observable<any> {
    return this.http.post<any>(
      `${this.baseURL}/findRegistryByToken`,
      consume,
      { headers: this.headers }
    ).pipe();
  }

  findAllRegistries(): Observable<any> {
    return this.http.get<any>(
      `${this.baseURL}/findAllRegistries`,
      { headers: this.headers }
    );
  }
}
