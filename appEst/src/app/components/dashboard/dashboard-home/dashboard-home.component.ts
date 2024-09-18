import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {WebSocketService} from "../../../services/webSocket/web-socket.service";

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit{

  constructor(private router:Router,
              private ws:WebSocketService) {
  }

  handleNavigate(component:string){
    this.router.navigate([`dashboard/${component}`]).then(() => null);
  }

  ngOnInit(): void {
    this.ws.disconnect();
  }

}
