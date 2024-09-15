import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MyErrorStateMatcher} from "../../validators/MyErrorStateMatcher";
import {UsersService} from "../../../services/users/users.service";
import {emailAsyncValidator, usernameAsyncValidator} from "../../validators/Validators";
import Swal from "sweetalert2";
import {ConsumeUsuario} from "../../../models/consume/ConsumeJsonGeneric";
import {ConsumeJsonLong} from "../../../models/consume/ConsumeJsonLong";
import {Router} from "@angular/router";

@Component({
  selector: 'app-usr-conf',
  templateUrl: './usr-conf.component.html',
  styleUrls: ['./usr-conf.component.scss']
})
export class UsrConfComponent implements OnInit{
  @Input() cveusr:number = 0;
  @Input() tokenusr: string ="";
  @Input() cancelComponent: string = '/home';
  form: FormGroup;
  formCarPlate: FormGroup;
  matcher = new MyErrorStateMatcher();
  showPassword: boolean = false;

  consume: ConsumeUsuario = {
    datos: {
      email: "",
      login: "",
      idcar: [],
      nameusr: "",
      password: "",
      typeusr: ""
    }
  };

  constructor(private userService: UsersService,
              private fb: FormBuilder,
              private router:Router) {
    this.form = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/), // Expresión regular básica
        Validators.minLength(5),
        Validators.maxLength(254)
      ],
        [emailAsyncValidator(this.userService)]
      ],
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern('^[a-zA-Z0-9_]*$')
      ], [usernameAsyncValidator(this.userService)]],
      name: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z]+(?: [a-zA-Z]+)*$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
      ]],
      role:['',[
        Validators.required
      ]]
    });
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
    this.validDataForm()
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  validDataForm():void{
    const storedUsr = localStorage.getItem('user');
    if (storedUsr && this.cveusr === 0) {
      const usr = JSON.parse(storedUsr);
      this.populateForm(usr);
    }

    if (this.cveusr > 0) {
      this.findUsrByCveusr(this.cveusr, (usr: any) => {
        if (usr) {
          this.populateForm(usr);
        }
      });
    }
  }

  findUsrByCveusr(cveusr: number, callback: (usr: any) => void): void {
    const consume: ConsumeJsonLong = {
      id: cveusr
    };

    this.userService.findUserByCveusr(consume).subscribe({
      next: (response: any) => {
        if (response.datos.code === 200) {
          const usr = response.datos.obj;
          console.log(usr);
          callback(usr); // Ejecuta el callback con el usuario encontrado
        } else {
          console.log("No se encontró usuario con clave ", cveusr);
          callback(null); // En caso de error, también ejecuta el callback con null
        }
      },
      error: () => {
        console.log("Error en la solicitud");
        callback(null);
      }
    });
  }

  populateForm(usr:any){
    console.log(usr)
    this.form.get('email')?.setValue(usr.emailusr)
    this.form.get('username')?.setValue(usr.loginusr)
    this.form.get('name')?.setValue(usr.nameusr)
    this.form.get('password')?.setValue(usr.passwordusr)
    this.form.get('role')?.setValue(usr.typeusr)
  }

  saveUser(): void {
    if (this.form.valid) {
      const formValues = this.form.value;
      if (this.cveusr !== 0){this.consume.datos.cveusr = this.cveusr}
      this.consume.datos.email = formValues.email;
      this.consume.datos.login = formValues.username;
      this.consume.datos.nameusr = formValues.name;
      this.consume.datos.password = formValues.password;
      this.consume.datos.typeusr = formValues.role;
      if (this.tokenusr !== null || this.tokenusr !==''){this.consume.datos.token = this.tokenusr;}

      console.log('Form data:', this.form.value);
      this.userService.createOrUpdateUsr(this.consume)
        .subscribe({
          next: (response) => {
            if (response.datos.code === 401 || response.datos.code === 400) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              }).then(() => {
              });
            } else {
              Swal.fire({
                icon: "success",
                title: "Exito",
                text: "Usuario Creado correctamente",
              }).then(() => this.ngOnInit());
            }
          },
          error: (error) => {
            console.error('Error en la solicitud:', error);
          }
        });
    } else {
      console.log('Form is invalid');
    }
  }

  handleNavigate(component:string){
    this.router.navigate([component]).then(() => null);
  }
}
