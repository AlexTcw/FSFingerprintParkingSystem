import {Component, OnInit} from '@angular/core';
import {RegistryService} from "../../../services/resgistry/registry.service";
import {ConsumeJsonGeneric, ConsumeJsonGenericToken} from "../../../models/consume/ConsumeJsonGeneric";
import {Router} from "@angular/router";
import {UtilService} from "../../../services/util/util.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  token:string|null = "";
  fechaEntrada: string = "";
  horaEntrada: string = "";

  constructor(private registryService: RegistryService,
              private router:Router,
              private util:UtilService) {
  }

  ngOnInit(): void {
    this.saveRegistry();
    this.util.initialize();
  }

  saveRegistry(): void {
    const token = sessionStorage.getItem('token');

    if (token !== null) {
      this.token = token; // Aquí 'this.token' siempre será de tipo 'string'

      const consume: ConsumeJsonGenericToken = { datos: { token: this.token } };
      this.registryService.setNewRegistryByToken(consume).subscribe((response: any) => {
        if (response.datos && response.datos.code === 200) {
          this.fechaEntrada = response.datos.obj.fecha.value1;
          this.horaEntrada = response.datos.obj.fecha.value2;
        }
      });
    } else {
      console.error("No token found in sessionStorage");
    }
  }

  handleNavigate(component:string){
    this.router.navigate([component]).then(() => null);
  }
}
