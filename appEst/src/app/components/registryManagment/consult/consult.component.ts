import { Component } from '@angular/core';
import Swal from "sweetalert2";
import {RegistryService} from "../../../services/resgistry/registry.service";
import {ConsumeJsonGenericToken} from "../../../models/consume/ConsumeJsonGeneric";
import {Router} from "@angular/router";

@Component({
  selector: 'app-consult',
  templateUrl: './consult.component.html',
  styleUrls: ['./consult.component.scss']
})
export class ConsultComponent {

  fechaEntrada: string = "";
  horaEntrada: string = "";
  tiempoUso: string = "";

  constructor(private registryService:RegistryService,
              private router:Router) {
  }

  ngOnInit(): void {
    this.getRegistryByToken();
  }

  getRegistryByToken(): void {
    const token = sessionStorage.getItem('token');

    if (token) {
      const consume: ConsumeJsonGenericToken = {
        datos: {
          token: token
        }
      };

      this.registryService.findRegistryByToken(consume).subscribe(
        response => {
          if (response.datos && response.datos.code === 200) {
            const { obj } = response.datos;
            this.fechaEntrada = obj.fecha.value1;
            this.horaEntrada = obj.fecha.value2;
          }
        },
        error => {
          // Manejo de errores
          console.error('Error al obtener el registro por token:', error);
        }
      );
    } else {
      console.warn('Token no encontrado en sessionStorage.');
    }
  }

  handleNavigate(component:string){
    this.router.navigate([`/${component}`]).then(() => null);
  }



}
