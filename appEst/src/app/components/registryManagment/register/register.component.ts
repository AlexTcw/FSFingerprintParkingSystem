import {Component, OnInit} from '@angular/core';
import {RegistryService} from "../../../services/resgistry/registry.service";
import {ConsumeJsonGeneric, ConsumeJsonGenericToken} from "../../../models/consume/ConsumeJsonGeneric";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  token:string|null = "";
  fechaEntrada: string = "";
  horaEntrada: string = "";

  constructor(private registryService: RegistryService) {
  }

  ngOnInit(): void {
    this.saveRegistry()
  }

  saveRegistry(): void {
    const token = sessionStorage.getItem('token');

    if (token !== null) {
      this.token = token; // Aquí 'this.token' siempre será de tipo 'string'

      const consume: ConsumeJsonGenericToken = { datos: { token: this.token } };
      this.registryService.setNewRegistryByToken(consume).subscribe((response: any) => {
        if (response.datos && response.datos.code === 200) {
          console.log(response.datos.obj.fecha.value1);
          console.log("Success");
          this.fechaEntrada = response.datos.obj.fecha.value1;
          this.horaEntrada = response.datos.obj.fecha.value2;
        }
      });
    } else {
      console.error("No token found in sessionStorage");
    }
  }
}
