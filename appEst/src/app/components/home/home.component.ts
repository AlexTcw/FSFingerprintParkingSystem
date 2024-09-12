import {Component, OnInit} from '@angular/core';
import {WebSocketService} from "../../services/webSocket/web-socket.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RegistryService} from "../../services/resgistry/registry.service";
import {MatDialog} from "@angular/material/dialog";
import {UsersService} from "../../services/users/users.service";
import {MyErrorStateMatcher} from "../../shared/validators/MyErrorStateMatcher";
import {ConsumeJsonStringString} from "../../models/consume/ConsumeJsonStringString";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    protected readonly localStorage = localStorage;

    /*Component variables*/
  form: FormGroup;
  connected: boolean = false;
  rotatedState: number = 0;
  message: string = "";
  showPassword: boolean = false;
  matcher:MyErrorStateMatcher = new MyErrorStateMatcher();

    constructor(private webSocketService: WebSocketService,
                private router: Router,
                private fb: FormBuilder,
                private registryService: RegistryService,
                private dialog: MatDialog,
                private userService:UsersService) {
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
      this.resetState();
      /*
      * this.connect();*/
  }

  /*
  private connect() {
    this.webSocketService.connect((message) => this.handleMessage(message));
    this.connected = true;}

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
   */

  private resetState(): void {
    this.rotatedState = 0;
    localStorage.clear()
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    if (this.form.valid) {
      /*Validamos si recibimos todos los parametros*/
      const formValues = this.form.value;

      /*Priero creamos la entidad que será consumida*/
      const consume: ConsumeJsonStringString = {
        value1: formValues.emailOrUsername,
        value2: formValues.password
      };

      /*First: try with username*/
      this.userService.findUserByLoginAndPassword(consume).subscribe((response:any)=>
        {
          if (response.datos && response.datos.code === 200) {
            localStorage.setItem('user', JSON.stringify(response.datos.obj));
            console.log('User success');
            this.router.navigate(['/dashboard']);
          } else {
            /*If the user was not found, try the email*/
            this.userService.findUsrByEmailAndPassword(consume).subscribe((emailResponse:any)=>
            {
              if (emailResponse.datos && response.datos.code === 200) {
                localStorage.setItem('user', JSON.stringify(emailResponse.datos.obj));
                console.log('User success');
                this.router.navigate(['/dashboard']);
              } else {
                //If both attempts fail, we display an error message
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
