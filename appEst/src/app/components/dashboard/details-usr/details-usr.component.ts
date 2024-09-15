import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UsersService} from "../../../services/users/users.service";
import Swal from "sweetalert2";
import {ConsumeJsonLong} from "../../../models/consume/ConsumeJsonLong";

@Component({
  selector: 'app-details-usr',
  templateUrl: './details-usr.component.html',
  styleUrls: ['./details-usr.component.scss']
})
export class DetailsUsrComponent implements OnInit {
  cveusr:number = 0;

  constructor(private route:ActivatedRoute,
              private usrService:UsersService,
              private router:Router) {
  }

  ngOnInit(): void {
    this.cveusr = Number(this.route.snapshot.paramMap.get('cveusr'));
  }

  deleteUsrByCveUsr(){
    Swal.fire({
      title: "Estas seguro?",
      text: "No podrás deshacer esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "confirmar"
    }).then((result) => {
      if (result.isConfirmed) {
        const consume:ConsumeJsonLong ={
          id:this.cveusr
        }
        this.usrService.deleteUsrByCveUsr(consume).subscribe(
          {
            next:(response: any) => {
              if (response.datos.code === 200) {
                Swal.fire({
                  title: "Exito",
                  text: "Usuario eliminado correctamente",
                  icon: "success"
                }).then(() => this.router.navigate(['/dashboard/active-users']));
              } else {
                Swal.fire({
                  title: "Error",
                  text: "Ocurrio un error, intente mas tarde",
                  icon: "error"
                }).then(() => this.ngOnInit());
              }
            }
          }
        )
      }
    });
  }

}
