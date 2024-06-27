import { Component, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Catalogo } from '../../models/catalogo.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { MatPaginator } from '@angular/material/paginator';
import { Usuario } from '../../models/usuario.model';
import { MatDialog } from '@angular/material/dialog';
import { DataCatalogoService } from '../../services/data-catalogo.service';
import { TokenService } from '../../security/token.service';
import { CrudDataCatalogoAgregarComponent } from '../crud-data-catalogo-agregar/crud-data-catalogo-agregar.component';
import { MatTableDataSource } from '@angular/material/table';
import { CrudCoordenadaActualizarComponent } from '../crud-coordenada-actualizar/crud-coordenada-actualizar.component';
import Swal from 'sweetalert2';
import { CrudDataCatalogoActualizarComponent } from '../crud-data-catalogo-actualizar/crud-data-catalogo-actualizar.component';

@Component({
  selector: 'app-crud-data-catalogo',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-data-catalogo.component.html',
  styleUrl: './crud-data-catalogo.component.css'
})
export class CrudDataCatalogoComponent {
  //Datos para la Grila
  dataSource:any;
  //formRegistrar: FormGroup;
  catalogoList: Catalogo[] = [];
//Clase para la paginacion
@ViewChild (MatPaginator, { static: true }) paginator!: MatPaginator;
 //Cabecera
 displayedColumns = ["idDataCatalogo","descripcion","catalogo","estado", "acciones"];
  //filtro de la consulta
  filtro: string = "";

  objUsuario: Usuario = {} ;
  constructor(private dialogService: MatDialog,
    private dataCatalogService: DataCatalogoService,
    private tokenService: TokenService ){
this.objUsuario.idUsuario = tokenService.getUserId();
}
openDialogRegistrar() {
  console.log(">>> openDialogRegistrar [ini]");
  const dialogRef = this.dialogService.open(CrudDataCatalogoAgregarComponent);
  dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog closed with result:', result);
        if (result != null && result === 1) {
          this.refreshTable();
        }
  });
  console.log(">>> openDialogRegistrar [fin]");
}
openDialogActualizar(obj: DataCatalogo) {
  console.log(">>> openDialogActualizar [ini]");
  console.log("obj: ", obj);
  const dialogRef = this.dialogService.open(CrudDataCatalogoActualizarComponent, {data: obj} );
  dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      if (result != null && (result === 1 || result === 2)) {
            this.refreshTable();
      }
  });
  console.log(">>> openDialogActualizar [fin]");
}
refreshTable(){
  console.log(">>> refreshTable [ini]");
  var msgFiltro = this.filtro == "" ? "todos":  this.filtro;
  this.dataCatalogService.consultarCrud(msgFiltro).subscribe(
        x => {
          this.dataSource = new MatTableDataSource<DataCatalogo>(x);
          this.dataSource.paginator = this.paginator
        }
  );

  console.log(">>> refreshTable [fin]");
}
updateEstado(obj:DataCatalogo) {
  console.log(">>> updateEstado [ini]");
  console.log("obj: ", obj);
  obj.estado = obj.estado == 1 ? 0 : 1;
  this.dataCatalogService.actualizarDataCatalogo(obj).subscribe(
      x => {
          this.refreshTable();
      }
  );
   console.log(">>> updateEstado [fin]");
}
delete(obj: DataCatalogo) {
  Swal.fire({
    title: '¿Desea eliminar?',
    text: "Los cambios no se van a revertir",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, elimina',
    cancelButtonText: 'No, cancelar'
    }).then((result) => {
          if (result.isConfirmed) {
              this.dataCatalogService.eliminarCrud(obj.idDataCatalogo || 0).subscribe(
                    x => {
                          this.refreshTable();
                          Swal.fire('Mensaje', x.mensaje, 'info');
                    }
              );
          }
    })
}
}
