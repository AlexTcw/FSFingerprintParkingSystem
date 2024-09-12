import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MyErrorStateMatcher} from "../../../shared/validators/MyErrorStateMatcher";
import {UsersService} from "../../../services/users/users.service";
import {EstacionamientoService} from "../../../services/estacionamiento/estacionamiento.service";
import {Router} from "@angular/router";
import {emailAsyncValidator, usernameAsyncValidator} from "../../../shared/validators/Validators";
import Swal from "sweetalert2";
import {ConsumeJsonGeneric, ConsumeUsuario} from "../../../models/consume/ConsumeJsonGeneric";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  form: FormGroup;
  formCarPlate: FormGroup;
  matcher = new MyErrorStateMatcher();
  showPassword: boolean = false;
  validForm: boolean = false;
  cveusr: any;

  constructor(private userService: UsersService,
              private fb: FormBuilder,
              private estService:EstacionamientoService,
              private router:Router,) {
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
  }

  async showUsrError(token: string): Promise<void> {
    await Swal.fire({
      title: 'Error',
      text: 'Se ha encontrado un usuario con este token. El almacenamiento de huellas será reiniciado.',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });

    // Borra el fingerprint del localStorage
    localStorage.removeItem('fingerprint');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  unsetTokenFromLocalStorage(): void {
    localStorage.removeItem('fingerprint');
    localStorage.removeItem('iscreating');
  }

  saveUser(): void {
    if (this.form.valid) {
      const formValues = this.form.value;

      const consume: ConsumeUsuario = {
        datos: {
          email: formValues.email,
          login: formValues.username,
          idcar: [], // Assuming this should be an empty array
          nameusr: formValues.name,
          password: formValues.password,
          typeusr: formValues.role
        }
      };

      console.log('Form data:', this.form.value);
      this.userService.createOrUpdateUsr(consume)
        .subscribe({
          next: (response) => {
            if (response.datos.code === 401 || response.datos.code === 400) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              }).then(() => {
                this.unsetTokenFromLocalStorage();
                //this.dialogRef.close(); // Cierra el diálogo en caso de error
              });
            } else {
              Swal.fire({
                icon: "success",
                title: "Exito",
                text: "Usuario Creado correctamente",
              }).then(() => {this.router.navigate(['/dashboard/dashboard-home']);});
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

}
