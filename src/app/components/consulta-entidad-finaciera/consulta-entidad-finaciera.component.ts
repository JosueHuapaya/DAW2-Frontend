import { Component, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MatPaginator } from '@angular/material/paginator';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { UtilService } from '../../services/util.service';
import { EntidadFinancieraService } from '../../services/entidad-financiera.service';

@Component({
  selector: 'app-consulta-entidad-finaciera',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './consulta-entidad-finaciera.component.html',
  styleUrl: './consulta-entidad-finaciera.component.css'
})
export class ConsultaEntidadFinacieraComponent {

  dataSource:any;
  @ViewChild (MatPaginator, {static:true}) paginator!: MatPaginator;
  displayedColumns = ["idEntidadFinanciera","nombre","gerente","tipoEntidad","ubigeo","estado", "fechaRegistro"]
  listaTipo:DataCatalogo[]=[];
  varNombre:string = "";
  varGerente:string= "";
  varEstado:boolean = false;
  varTipo:number = -1;
  constructor(private utilService:UtilService, private servicio:EntidadFinancieraService){}
  ngOnInit(){
    this.utilService.listaTipoEntidadBancaria().subscribe(
      x => this.listaTipo = x
    );
  }

  filtrado(){
    console.log(">>> Actualizar Tabla [INICIO]");
    console.log(">>> Actualizar Tabla >>> this.nombre   >> " + this.varNombre);
    console.log(">>> Actualizar Tabla >>> this.gerente   >> " + this.varGerente);
    console.log(">>> Actualizar Tabla >>> this.entidad   >> " + this.varTipo);
    console.log(">>> Actualizar Tabla >>> this.estado   >> "+ this.varEstado);

    this.servicio.EntidadFinancieraConsulta(
      this.varNombre,
      this.varGerente,
      this.varTipo,
      this.varEstado ? 1 : 0) .subscribe(
        data => {
          this.dataSource = data;
          this.dataSource.paginator = this.paginator;
        }
      );
      console.log(">>> Actualizar Tabla [FIN]")
  }
}
