import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom, Observable} from "rxjs";
import {ConsumeJsonGeneric, ConsumeJsonPage, ConsumeUsuario} from "../../models/consume/ConsumeJsonGeneric";
import {ConsumeJsonString} from "../../models/consume/ConsumeJsonString";
import {ConsumeJsonLong} from "../../models/consume/ConsumeJsonLong";
import {ConsumeJsonStringString} from "../../models/consume/ConsumeJsonStringString";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  baseURL = `${environment.backendURL}/usr`;
  headers = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient) { }

  createOrUpdateUsr(consume: ConsumeUsuario): Observable<any> {
    return this.http.post<any>(
      `${this.baseURL}/createOrUpdateUsr`,
      consume,
      { headers: this.headers }
    ).pipe();
  }

  deleteUsrByCveUsr(consume: ConsumeJsonLong): Observable<any> {
    return this.http.post<any>(
      `${this.baseURL}/deleteUsrByCveUsr`,
      consume,
      { headers: this.headers }
    ).pipe();
  }

  findAllUsers(consume: ConsumeJsonPage): Observable<any> {
    return this.http.post<any>(
      `${this.baseURL}/findAllUsers`,
      consume,
      { headers: this.headers }
    ).pipe();
  }

  findUserByCveusr(consume: ConsumeJsonLong): Observable<any> {
    return this.http.post<any>(
      `${this.baseURL}/findUserByCveusr`,
      consume,
      { headers: this.headers }
    ).pipe();
  }

  findUsrByEmailAndPassword(consume: ConsumeJsonStringString): Observable<any> {
    return this.http.post<any>(
      `${this.baseURL}/findUsrByEmailAndPassword`,
      consume,
      { headers: this.headers }
    ).pipe();
  }

  findUserByLoginAndPassword(consume: ConsumeJsonStringString): Observable<any> {
    return this.http.post<any>(
      `${this.baseURL}/findUserByLoginAndPassword`,
      consume,
      { headers: this.headers }
    ).pipe();
  }


  findUserByToken(consume: ConsumeJsonString): Observable<any> {
    return this.http.post<any>(
      `${this.baseURL}/findUserByToken`,
      consume,
      { headers: this.headers }
    ).pipe();
  }

  /*Para que funcionen los validadores*/
  validLogin(data: any): Observable<any> {
    const headers = this.headers;
    return this.http.post(`${this.baseURL}/validLogin`, data, {headers});
  }

  validEmail(data: any): Observable<any> {
    const headers = this.headers;
    return this.http.post(`${this.baseURL}/validEmail`, data, {headers});
  }

  async existUsrByToken(token:string):Promise<boolean> {
    const consume:ConsumeJsonString = {name:token}
    try {
      const response:any = await firstValueFrom(this.findUserByToken(consume));
      return response.datos.code === 200;
    } catch (error) {
      console.log(error)
      return false;
    }
  }
}
