import {Component, OnInit} from '@angular/core';
import {RegistryService} from "../../../services/resgistry/registry.service";
import {ConsumeJsonGenericToken} from "../../../models/consume/ConsumeJsonGeneric";
import {Router} from "@angular/router";
import {UtilService} from "../../../services/util/util.service";
import {ConsumeJsonString} from "../../../models/consume/ConsumeJsonString";
import {WebSocketService} from "../../../services/webSocket/web-socket.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-consult',
  templateUrl: './consult.component.html',
  styleUrls: ['./consult.component.scss']
})
export class ConsultComponent implements OnInit{

  fechaEntrada: string = "";
  horaEntrada: string = "";
  cvereg:number = 0;
  tiempoUso: string = "";

  constructor(private registryService:RegistryService,
              private router:Router,
              private util:UtilService,
              private ws:WebSocketService) {
  }

  ngOnInit(): void {
    this.getRegistryByToken();
    this.util.initialize();
  }

  getRegistryByToken(): void {
    const token = sessionStorage.getItem('token');

    if (!token) {
      console.warn('Token no encontrado en sessionStorage.');
      return;
    }

    const consume: ConsumeJsonGenericToken = {
      datos: {
        token: token
      }
    };

    this.registryService.findRegistryByToken(consume).subscribe({
      next: (response) => {
        if (response?.datos?.code === 200 && response.datos.obj) {
          const { obj } = response.datos;
          if (obj.fecha) {
            console.log(obj)
            this.fechaEntrada = obj.fecha.value1;
            this.horaEntrada = obj.fecha.value2;
            this.tiempoUso = obj.duracion.name
            this.cvereg = obj.cvereg
          } else {
            console.warn('Fecha no disponible en el objeto.');
          }
        } else {
          console.warn('Código de respuesta no es 200 o el objeto no está disponible.');
        }
      },
      error: (error) => {
        // Manejo de errores
        console.error('Error al obtener el registro por token:', error);
      }
    });
  }

  unsetRegistry(){
    const token = sessionStorage.getItem('token');
    if (token && this.cvereg > 0){
      const consume: ConsumeJsonGenericToken = {
        datos: {
          token: token,
          cvereg:this.cvereg
        }
      };

      this.registryService.setNewRegistryByToken(consume).subscribe({
        next:(response => {
          if (response.datos.code === 200){
            this.handleNavigate('home')
          }
        })
      })
    }
  }

  sendSignal(){
    const token = sessionStorage.getItem('token');
    if (token){
      const consume: ConsumeJsonString = {
        name:token
      };

      this.ws.sendSignal(consume).subscribe({
        next:(response => {
          if (response.datos.code === 200){
            Swal.fire({
              title: "Verifique su telefono",
              text: "Presione salir en nuestra aplicacion de lo contrario use el boton que observa en la pantall",
              icon: "info",
              timer: 60000 // Duración del temporizador en milisegundos (1 minuto)
            }).then(() => null);
          }
        })
      })
    }
  }

  handleNavigate(component:string){
    this.router.navigate([`/${component}`]).then(() => null);
  }
}
