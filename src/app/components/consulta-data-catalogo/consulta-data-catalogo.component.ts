import { Component, ViewChild } from '@angular/core';
import { Catalogo } from '../../models/catalogo.model';
import { MatPaginator } from '@angular/material/paginator';
import { DataCatalogoService } from '../../services/data-catalogo.service';
import { UtilService } from '../../services/util.service';
import { MenuComponent } from '../../menu/menu.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../../app.material.module';

@Component({
  selector: 'app-consulta-data-catalogo',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './consulta-data-catalogo.component.html',
  styleUrl: './consulta-data-catalogo.component.css'
})
export class ConsultaDataCatalogoComponent {

  catalogoList:Catalogo[] = [];
  //Filtro de la consulta
  descripcion: string = "";
  estado: boolean = true;
  idCatalogo: number = -1;
  //Datos para la Grila
  dataSource:any;
//Clase para la paginacion
@ViewChild (MatPaginator, { static: true }) paginator!: MatPaginator;
//Cabecera
displayedColumns = ["idDataCatalogo","descripcion","catalogo","estado"];
constructor(private dataCatalogoService: DataCatalogoService,
  private utilService: UtilService) {
}
loadDataCatalogos(): void {
  this.dataCatalogoService.listaCatalogo().subscribe({
    next: (data) => {
      this.catalogoList = data;
    },
    error: (error) => console.error('Error al cargar los datos del catálogo', error)
  });
}
ngOnInit() {
  console.log(">>> ngOnInit [ini]");
  this.loadDataCatalogos();
  console.log(">>> ngOnInit [fin]");
}
consultar() {
  console.log(">>> consultar [ini]");
  console.log("descripcion: ", this.descripcion);
  console.log("estado: ", this.estado);
  console.log("idCatalogo: ", this.idCatalogo);
  this.dataCatalogoService.consultaDataCatlogo(this.descripcion,
    this.estado?1:0,this.idCatalogo,).subscribe(
    data => {
      this.dataSource = data;
      this.dataSource.paginator = this.paginator;
    }
  );
  console.log(">>> consultar [fin]");
}
}
