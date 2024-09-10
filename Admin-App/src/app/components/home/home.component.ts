import {Component, OnInit} from '@angular/core';
import {WebSocketService} from "../../services/web-socket.service";
import {Router} from "@angular/router";
import {RegistryService} from "../../services/registry.service";
import {MatDialog} from "@angular/material/dialog";
import {SignupComponent} from "../users/signup/signup.component";
import {UserService} from "../../services/user.service";
import { firstValueFrom } from 'rxjs';
import {MyErrorStateMatcher} from "../util/form/MyErrorStateMatcher";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {emailAsyncValidator, usernameAsyncValidator} from "../util/form/Validators";
import Swal from "sweetalert2";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  form: FormGroup;
  hide = true;
  connected: boolean = false;
  message: string = "";
  rotatedState: number = 1;
  creatingUser: number = 0;
  showPassword: boolean = false;
  matcher = new MyErrorStateMatcher();
  protected readonly localStorage = localStorage;

  constructor(private webSocketService: WebSocketService,
              private router: Router,
              private fb: FormBuilder,
              private registryService: RegistryService,
              private dialog: MatDialog,
              private userService:UserService) {
    this.form = this.fb.group({
      emailOrUsername: ['', [
        Validators.required,
        Validators.minLength(3),  // Mínimo 3 caracteres
        Validators.maxLength(254) // Máximo 254 caracteres
      ]],
      password: ['', [
        Validators.required,
        //Validators.minLength(8),
        Validators.maxLength(20),
        //Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
      ]]
    });
  }

  ngOnInit(): void {
    this.connect();
    localStorage.clear();
    this.resetState();
  }

  /*Conexion de webSockets*/
  private connect() {
    /*Primero tratamos de conectar*/
    this.webSocketService.connect((message) => this.handleMessage(message));
    this.connected = true;
  }



  private handleMessage(message: any) {
    if (!message || !message.content) {
      this.message = 'Received empty or invalid message';
      console.log(this.message);
      return;
    }

    const content = message.content;
    const match = content.match(/Hello, (\d+)/);

    if (!match) {
      this.message = 'Received message does not match expected format';
      console.log(this.message);
      return;
    }

    const token:string = match[1];
    /*Si se conecta validamos el registro con el token*/
    this.existUsrOrRegistryByToken(token).then(() => null);
    return;
  }

  private async existUsrOrRegistryByToken(token: any) {
    localStorage.setItem('fingerprint', token);
    const validUser: boolean = await this.userService.validateUsrByToken(token);

    if (this.creatingUser != 1){
      if (validUser) { // Si existe un usuario con ese token
        console.log("Hay un usuario");
        await this.router.navigate(['/dashboard']);
      } else { // No existe un usuario con ese token
        console.log("No hay usuario");
        const validRegistry: boolean = await this.validateRegistryByToken(token);
        if (validRegistry) { // Si ya tiene un registro - Solo consulta
          await this.router.navigate(['/consult']);
        } else { // No tiene registro - Lo crea
          await this.router.navigate(['/generic']);
        }
      }
    }
  }

  private async validateRegistryByToken(token:string):Promise<boolean>{
    const data: { value1?: string } = { value1: token };
    const response = await firstValueFrom(this.registryService.findRegistryByToken(data));
    try {
      if (response.datos.code === 200) {
        return true;
      } else if(response.datos.code === 401){
        localStorage.setItem('registry', JSON.stringify(response.datos));
        return false;
      }else{
        throw new Error('Unexpected response code');
      }
    }catch (error) {
      console.log(error)
      return false;
    }
  }

  async openDialog(): Promise<any> {
    return new Promise((resolve) => {
      const dialogRef = this.dialog.open(SignupComponent, {
        width: '50%',  // Ajusta el ancho del diálogo
        height: '85%'  // Ajusta la altura del diálogo
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'undefined' || result === undefined) {
          localStorage.removeItem('fingerprint');
        }
        this.resetState();
        resolve(result);
      });
    });
  }

  private resetState() {
    this.rotatedState = 0;
    this.creatingUser = 0;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  findUserByParam() {
    if (this.form.valid) {
      const formValues = this.form.value;
      const data = {
        value1: formValues.emailOrUsername,
        value2: formValues.password,
      };

      // Intentamos primero con el nombre de usuario
      this.userService.findUserByLoginAndPassword(data).subscribe(
        (response: any) => {
          if (response.datos && response.datos.code === 200) {
            // Usuario encontrado con el nombre de usuario, guardamos en localStorage
            localStorage.setItem('user', JSON.stringify(response.datos.obj));
            // Aquí puedes redirigir o realizar otra acción, por ejemplo:
            console.log('Usuario autenticado con nombre de usuario');
            this.router.navigate(['/dashboard']);

          } else {
            // Si no se encuentra con el nombre de usuario, intentamos con el correo electrónico
            this.userService.findUsrByEmailAndPassword(data).subscribe(
              (emailResponse: any) => {
                if (emailResponse.datos && emailResponse.datos.code === 200) {
                  // Usuario encontrado con el correo, guardamos en localStorage
                  localStorage.setItem('user', JSON.stringify(emailResponse.datos.obj));
                  // Aquí puedes redirigir o realizar otra acción
                  console.log('Usuario autenticado con correo electrónico');
                  this.router.navigate(['/dashboard']);
                } else {
                  // Si ambos intentos fallan, mostramos un mensaje de error
                  this.form.setErrors({ invalid: true });
                }
              },
              (emailError) => {
                // En caso de error en la llamada del correo
                this.form.setErrors({ invalidLogin: true });
              }
            );
          }
        },
        (error) => {
          // En caso de error en la llamada del nombre de usuario
          this.form.setErrors({ invalidLogin: true });
        }
      );
    }
  }
}
