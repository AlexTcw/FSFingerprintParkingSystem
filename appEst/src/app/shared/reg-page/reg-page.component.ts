import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ConsumeJsonPage} from "../../models/consume/ConsumeJsonGeneric";
import {FormControl, FormGroup} from "@angular/forms";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {EstacionamientoService} from "../../services/estacionamiento/estacionamiento.service";
import {UtilService} from "../../services/util/util.service";
import {ResponseJsonPage} from "../../models/response/ResponseJsonPage";
import {MatTabChangeEvent} from "@angular/material/tabs";

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();


@Component({
  selector: 'app-reg-page',
  templateUrl: './reg-page.component.html',
  styleUrls: ['./reg-page.component.scss']
})
export class RegPageComponent implements OnInit{
  @Input() actFlag:number = 0;
  displayedColumns: String[] = ['id', 'email', 'username', 'name', 'date'];
  dataSource = new MatTableDataSource<any>();
  consume:ConsumeJsonPage = {
    datos:{
      actFlag:this.actFlag
    }
  }

  searchInitValue:string = "";
  dateRange = new FormGroup({
    start: new FormControl(new Date(year, month, 13)),
    end: new FormControl(new Date(year, month, 16)),
  });

  length:number = 0;
  pageSize:number =0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private estService:EstacionamientoService,
              private util:UtilService) {
  }

  ngOnInit(): void {
    this.getEstByParam(this.consume);
    this.dateRange.valueChanges.subscribe(() => this.onDateRangeChange());
  }

  getEstByParam(consume: ConsumeJsonPage): void {
    this.estService.searchEstByParam(consume).subscribe({
      next: (response: ResponseJsonPage) => {
        if (response.datos && response.datos.obj && response.datos.code === 200) {
          // Mapeo de los datos
          this.dataSource.data = response.datos.obj.content.map((item: any[]) => ({
            id: item[0],
            email: item[1],
            username: item[2],
            name: item[3],
            date: item[4]
          }));
          this.length = response.datos.obj.totalElements;
          this.pageSize = response.datos.obj.size;
        } else {
          this.dataSource.data = [];
        }
      }
    });
  }

  onPageChange(event:PageEvent):void {
    // Verificar que consume.datos existe
    if (this.consume && this.consume.datos) {
      this.consume.datos.size = event.pageSize;
      this.consume.datos.page = event.pageIndex;

      // Llamar a getEstByParam con los nuevos valores
      this.getEstByParam(this.consume);
    }
  }

  onSearch():void{
    if (this.consume && this.consume.datos) {
      this.consume.datos.key = this.searchInitValue
      this.consume.datos.page = 0;

      this.getEstByParam(this.consume);
    }
  }

  onDateRangeChange():void{
    if(this.dateRange.valid){
      const startDate = this.dateRange.get('start')?.value;
      const endDate = this.dateRange.get('end')?.value;

      this.consume.datos.startDate = startDate ? this.util.formatDate(startDate) : '';
      this.consume.datos.endDate = endDate ? this.util.formatDate(endDate) : '';
      this.consume.datos.page = 0;

      this.getEstByParam(this.consume)
    }
  }

  onTabChange(event:MatTabChangeEvent):void{
    const tabLabel = event.tab.textLabel.toLowerCase();
    if(tabLabel === 'admin'){
      this.consume.datos.type = '0';
    } else if(tabLabel === 'generic'){
      this.consume.datos.type = '2';
    } else if (tabLabel === 'regular') {
      this.consume.datos.type = '1';
    }
    this.consume.datos.page = 0;

    this.getEstByParam(this.consume);
  }
}
