import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {UsersService} from "../../../services/users/users.service";
import {Router} from "@angular/router";
import {ConsumeJsonPage} from "../../../models/consume/ConsumeJsonGeneric";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatTabChangeEvent} from "@angular/material/tabs";

@Component({
  selector: 'app-active-users',
  templateUrl: './active-users.component.html',
  styleUrls: ['./active-users.component.scss']
})

export class ActiveUsersComponent implements OnInit{
  displayedColumns: string[] = ['id','email','username','name','password','token']; // Define las columnas de la tabla
  dataSource = new MatTableDataSource<any>();
  consume:ConsumeJsonPage = {
    datos:{

    }
  }

  searchInitValue:string = "";
  length:number = 0;
  pageSize:number =0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private usuarioService: UsersService,
              private router:Router) { }

  ngOnInit(): void {
    this.getUserByType(this.consume);
  }

  getUserByType(consume:ConsumeJsonPage): void {
    this.usuarioService.findAllUsers(consume).subscribe({
      next: (response: any) => {
        if (response.datos && response.datos.obj && response.datos.code === 200) {
          this.dataSource.data = response.datos.obj.content.map((item: any[]) => ({
            id: item[0],
            email: item[1],
            username: item[2],
            name: item[3],
            password: item[4],
            token: item[5]
          }));
        } else {
          this.dataSource.data = []; // Maneja el caso en que no hay datos
        }
      },
      error: (error) => {
        console.error('Error al obtener datos', error); // Manejo de errores
      }
    });
  }

  onPageChange(event:PageEvent):void {
    // Verificar que consume.datos existe
    if (this.consume && this.consume.datos) {
      this.consume.datos.size = event.pageSize;
      this.consume.datos.page = event.pageIndex;

      // Llamar a getEstByParam con los nuevos valores
      this.getUserByType(this.consume);
    }
  }

  onSearch():void{
    if (this.consume && this.consume.datos) {
      this.consume.datos.key = this.searchInitValue
      this.consume.datos.page = 0;

      this.getUserByType(this.consume);
    }
  }

  onUserTypeChange(event: any): void {
    const selectedType = event.value; // Obtener el valor seleccionado del select
    console.log(selectedType)
    // Asignar el tipo al objeto consume
    if (selectedType === '0') {
      this.consume.datos.type = '0'; // Admin
    } else if (selectedType === '1') {
      this.consume.datos.type = '1'; // Regular
    } else if (selectedType === '2') {
      this.consume.datos.type = '2'; // Generic
    }

    // Reiniciar la paginación al cambiar de tipo de usuario
    this.consume.datos.page = 0;

    // Llamar a la función para obtener los datos de acuerdo al tipo seleccionado
    this.getUserByType(this.consume);
  }


  handleNavigate(row:any){
    const cveusr = row.id
    this.router.navigate(['/dashboard/active-users/details/',cveusr]).then(() => null);
  }
}
