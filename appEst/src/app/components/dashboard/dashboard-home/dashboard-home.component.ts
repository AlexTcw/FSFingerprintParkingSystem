import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import Swal from "sweetalert2";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MyErrorStateMatcher} from "../../../shared/validators/MyErrorStateMatcher";
import {MatTableDataSource} from "@angular/material/table";
import {ResponseJsonString} from "../../../models/response/ResponseJsonString";
import {EstacionamientoService} from "../../../services/estacionamiento/estacionamiento.service";
import {UsersService} from "../../../services/users/users.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent{

  constructor(private router:Router) {
  }

  handleNavigate(component:string){
    this.router.navigate([`dashboard/${component}`]).then(() => null);
  }

}
