import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom, Observable} from "rxjs";
import {ConsumeJsonGenericToken} from "../../models/consume/ConsumeJsonGeneric";

@Injectable({
  providedIn: 'root'
})
export class RegistryService {
  baseURL = `${environment.backendURL}/registry`;
  headers = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient) { }

  setNewRegistryByToken(consume: ConsumeJsonGenericToken): Observable<any> {
    return this.http.post<any>(
      `${this.baseURL}/createOrUpdateRegistry`,
      consume,
      { headers: this.headers }
    ).pipe();
  }

  findRegistryByToken(consume: ConsumeJsonGenericToken): Observable<any> {
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

  async existRegistryByToken(token:string):Promise<boolean> {
    const consume:ConsumeJsonGenericToken ={
      datos:{
        token:token,
      }
    }
    try {
      const response:any = await firstValueFrom(this.findRegistryByToken(consume));
      return response.datos.code === 200;
    } catch (error) {
      console.log(error)
      return false;
    }
  }
}
