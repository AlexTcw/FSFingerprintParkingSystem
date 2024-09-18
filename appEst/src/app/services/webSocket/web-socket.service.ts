import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {ConsumeJsonString} from "../../models/consume/ConsumeJsonString";
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  constructor(private http: HttpClient) { }

  baseURL = `${environment.backendURL}/api`;
  headers = new HttpHeaders({'Content-Type': 'application/json'});

  private webSocketEndPoint:string = `${environment.backendURL}/ws`;
  private stompClient:any;

  public connect(callback: (message: any) => void) {
    console.log('Initialize WebSocket Connection');
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect(
      {},
      () => {
        this.stompClient.subscribe('/topic/greetings', (sdkEvent: any) => {
          this.onMessageReceived(sdkEvent, callback);
        });
      },
      this.errorCallBack
    );
  }

  public disconnect() {
    if (this.stompClient !== null) {
      console.log('Disconnecting WebSocket connection');
      this.stompClient.disconnect(() => {
        console.log('WebSocket disconnected');
      });
    }
  }




  private errorCallBack(error: any) {
    console.log('Error callback -> ' + error);
    setTimeout((callback: (message: any) => void) => {
      this.connect(callback); // Reconnect on error
    }, 5000);
  }

  private onMessageReceived(message: any, callback: (message: any) => void) {
    callback(JSON.parse(message.body));
  }

  sendSignal(consume: ConsumeJsonString): Observable<any> {
    return this.http.post<any>(
      `${this.baseURL}/sendSignal`,
      consume,
      { headers: this.headers }
    ).pipe();
  }
}
