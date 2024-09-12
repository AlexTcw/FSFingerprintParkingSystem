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
export class DashboardHomeComponent implements OnInit{
  @ViewChild('icon') icon: ElementRef | undefined; // Ajusta el tipo según el uso
  typeUsr: number = 0;
  cveusr: number = 0;
  nameusr: string = "";
  loginusr: string = "";
  emailusr: string = "";
  idcar: string[] = []; // Especifica el tipo de array
  idcars: string[] = [];
  formCarPlate: FormGroup;
  tokenusr: string | null = "";
  matcher = new MyErrorStateMatcher();
  displayedColumns: string[] = ['idcar', 'actions'];
  dataSource = new MatTableDataSource<ResponseJsonString>(); // Asegúrate de que el tipo es correcto

  constructor(
    private renderer: Renderer2,
    private elRef: ElementRef,
    private fb: FormBuilder,
    private estService: EstacionamientoService,
    private userService: UsersService,
    private router: Router
  ) {
    this.formCarPlate = this.fb.group({
      carPlate: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(7),
        Validators.pattern('^[A-Z0-9-]*$')
      ]]
    });
  }

  ngOnInit(): void {
    this.populateData();
  }

  populateData(): void {
    const responseUserStr = localStorage.getItem('responseUser');

    if (responseUserStr) {
      const responseUser = JSON.parse(responseUserStr);
      console.log(responseUser.datos);
      const keys = Object.keys(responseUser.datos);
      const key = parseInt(keys[0], 10); // Asegúrate de usar la base 10
      this.cveusr = key;
      const userData = responseUser.datos[key];
      this.nameusr = userData.nameusr;
      this.loginusr = userData.loginusr;
      this.emailusr = userData.emailusr;
      this.idcar = userData.idcar;
      this.idcars = this.idcar.slice(0, 4);
      const transformedData: ResponseJsonString[] = this.idcars.map((id: string) => ({ name: id }));
      this.dataSource.data = transformedData;
      this.tokenusr = userData.tokenusr;
    }
  }

  async validateUsrByToken(token: string): Promise<boolean> {
    const data = {
      name: token
    };
    console.log(`datos ${JSON.stringify(data)}`);
    try {
      const response = await this.userService.findUserByToken(data).toPromise();
      if (response.datos.codigo === 404) {
        return false;
      } else {
        localStorage.setItem('responseUser', JSON.stringify(response));
        location.reload();
        return true;
      }
    } catch (error) {
      console.error('Error durante la validación del usuario', error); // Manejo de errores
      return false;
    }
  }

  navigateToComponent(compoent:any){
    this.router.navigateByUrl(compoent).then(()=>null);
  }
}
