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

  formatDate(date:Date):string{
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
}
