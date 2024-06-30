import { Component, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { SolicitudPrestamo } from '../../models/solicitud-prestamo.model';
import { MatTableDataSource } from '@angular/material/table';
import { SolicitudPrestamoService } from '../../services/solicitud-prestamo.service';
import { MatPaginator } from '@angular/material/paginator';
import { TokenService } from '../../security/token.service';
import { Usuario } from '../../models/usuario.model';
import { MatDialog } from '@angular/material/dialog';
import { CrudSolicitudPrestamoAgregarComponent } from '../crud-solicitud-prestamo-agregar/crud-solicitud-prestamo-agregar.component';
import { CrudSolicitudPrestamoActualizarComponent } from '../crud-solicitud-prestamo-actualizar/crud-solicitud-prestamo-actualizar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crud-solicitud-prestamo',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-solicitud-prestamo.component.html',
  styleUrl: './crud-solicitud-prestamo.component.css'
})
export class CrudSolicitudPrestamoComponent {

  //Filtro de la consulta
  filtro: string = "";

  //Clase para la paginacion
  @ViewChild (MatPaginator, { static: true }) paginator!: MatPaginator;

  //Cabecera de la tabla
  displayedColumns = ["idSolicitud","Capital","Días","Monto Pagar","Fecha Inicio","Fecha Fin","Estado Solicitud", "Prestatario", "Estado", "Fecha Registro", "Fecha Actualiz.", "Usuario Registro", "Usuario Actualiz.","acciones","acciones2","acciones3"];

  //Datos para la grilla
  dataSource:any;

  //Usuario
  objUsuario: Usuario = {};

  constructor(private solicitudPrestamoService: SolicitudPrestamoService,
              private dialogService: MatDialog, 
              private tokenService: TokenService){
  this.objUsuario.idUsuario = this.tokenService.getUserId();
  }

  refreshTable() {
    console.log(">>> refreshTable [ini]");
        var msgFiltro = this.filtro == "" ? "todos":  this.filtro;
        this.solicitudPrestamoService.consultarCrud(msgFiltro).subscribe(
              x => {
                this.dataSource = new MatTableDataSource<SolicitudPrestamo>(x);
                this.dataSource.paginator = this.paginator
              }
        );

    console.log(">>> refreshTable [fin]");
  }

  openDialogRegistrar() {
    console.log(">>> openDialogRegistrar [ini]");
    const dialogRef = this.dialogService.open(CrudSolicitudPrestamoAgregarComponent);
    dialogRef.afterClosed().subscribe(result => {
          console.log('Dialog closed with result:', result);
          if (result != null && result === 1) {
            this.refreshTable();
          }
    });
    console.log(">>> openDialogRegistrar [fin]");
  }

  openDialogActualizar(obj: SolicitudPrestamo) {
    console.log(">>> openDialogActualizar [ini]");
    console.log("obj: ", obj);
    const dialogRef = this.dialogService.open(CrudSolicitudPrestamoActualizarComponent, {data: obj} );
    dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog closed with result:', result);
        if (result != null && (result === 1 || result === 2)) {
              this.refreshTable();
        }
    });
    console.log(">>> openDialogActualizar [fin]");
  }

  updateEstado(obj: SolicitudPrestamo) {
    console.log(">>> updateEstado [ini]");
    console.log("obj: ", obj);
    obj.estado = obj.estado == 1 ? 0 : 1;
    this.solicitudPrestamoService.actualizarCrud(obj).subscribe(
        x => {
            this.refreshTable();
        }
    );
     console.log(">>> updateEstado [fin]");
  }

  delete(obj: SolicitudPrestamo) {
    Swal.fire({
      title: '¿Desea eliminar?',
      text: "Los cambios no se van a revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4394e0',
      cancelButtonColor: '#d5413c',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
      }).then((result) => {
            if (result.isConfirmed) {
                this.solicitudPrestamoService.eliminarCrud(obj.idSolicitud || 0).subscribe(
                      x => {
                            this.refreshTable();
                            Swal.fire('Mensaje', x.mensaje, 'info');
                      }
                );
            }
      })   
}

}
