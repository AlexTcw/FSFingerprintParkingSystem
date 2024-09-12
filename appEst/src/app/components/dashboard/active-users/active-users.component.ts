import {Component, OnInit} from '@angular/core';
import {Estacionamiento} from "../../../models/entity/Estacionamiento";
import {MatTableDataSource} from "@angular/material/table";
import {ConsumeJsonString} from "../../../models/consume/ConsumeJsonString";
import {UsersService} from "../../../services/users/users.service";
import {Usuario} from "../../../models/entity/Usuario";
import {ResponseJsonGeneric} from "../../../models/response/ResponseJsonGeneric";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-active-users',
  templateUrl: './active-users.component.html',
  styleUrls: ['./active-users.component.scss']
})
export class ActiveUsersComponent implements OnInit{
  nameusr = '';
  displayedColumns: string[] = ['nameusr','loginusr','emailusr','passwordusr','tokenusr']; // Define las columnas de la tabla
  dataSource = new MatTableDataSource<Usuario>();
  toggleTypeControl = new FormControl('0');

  constructor(private usuarioService: UsersService) { }

  ngOnInit(): void {
    this.getEstByType(this.toggleTypeControl.value);

    this.toggleTypeControl.valueChanges.subscribe((value: string | null) => {
      if (value) {
        this.getEstByType(value); // Actualiza los datos según el nuevo valor
      }
    });
  }

  getEstByType(type: string | null): void {
    if (type != null) {
      const consume: ConsumeJsonString = {
        name: type
      };

      this.usuarioService.findAllUsers(consume).subscribe({
        next: (response: ResponseJsonGeneric) => {
          // Verifica si la respuesta contiene datos y actualiza el dataSource
          if (response.datos && response.datos.obj) {
            this.dataSource.data = response.datos.obj;
          } else {
            this.dataSource.data = []; // Maneja el caso en que no hay datos
          }
          console.log(response); // Muestra la respuesta en consola
        },
        error: (error) => {
          console.error('Error al obtener datos', error); // Manejo de errores
        }
      });
    }
  }
}
