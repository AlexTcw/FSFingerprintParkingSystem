import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  baseURL = `${environment.backendURL}/util`;
  headers = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient) { }

  getFormattedCurrentDateTime(): Observable<any> {
    return this.http.get<any>(
      `${this.baseURL}/getFormattedCurrentDateTime`,
      { headers: this.headers }
    );
  }
}
