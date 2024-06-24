import { Component, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MatPaginator } from '@angular/material/paginator';
import { Usuario } from '../../models/usuario.model';
import { MatDialog } from '@angular/material/dialog';
import { TokenService } from '../../security/token.service';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { PrestatarioService } from '../../services/prestatario.service';
import { CrudPrestatarioAgregarComponent } from '../crud-prestatario-agregar/crud-prestatario-agregar.component';
import { CrudPrestatarioActualizarComponent } from '../crud-prestatario-actualizar/crud-prestatario-actualizar.component';
import { Prestatario } from '../../models/prestatario.model';


@Component({
  selector: 'app-crud-prestatario',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-prestatario.component.html',
  styleUrl: './crud-prestatario.component.css'
})
export class CrudPrestatarioComponent {
  dataSource: any;


  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  displayedColumns = ["idUsuario", "nombres", "apellidos", "dni", "login", "correo", "fechaNacimiento", "direccion", "estado", "acciones"];

  filtro: string = "";

  objUsuario: Usuario = {};

  constructor(private dialogService: MatDialog,
    private prestatarioService: PrestatarioService,
    private tokenService: TokenService) {
    this.objUsuario.idUsuario = tokenService.getUserId();
  }

  openDialogDeRegistrar() {
    console.log(">>> openDialogRegistrar [ini]");

    const dialogRef = this.dialogService.open(CrudPrestatarioAgregarComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      if (result != null && result === 1) {
        this.refreshTable();
      }
    });
    console.log(">>> openDialogRegistrar [fin]");
  }

  openDialogDeActualizar(obj: Prestatario) {
    console.log(">>> openDialogActualizar [ini]");
    console.log("obj: ", obj);

    const dialogRef = this.dialogService.open(CrudPrestatarioActualizarComponent, { data: obj });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      if (result != null && (result === 1 || result === 2)) {
        this.refreshTable();
      }
    });
    console.log(">>> openDialogActualizar [fin]");
  }

  refreshTable() {
    console.log(">>> refreshTable [ini]");
    var msgFiltro = this.filtro == "" ? "todos" : this.filtro;
    this.prestatarioService.consultarPrestatarioCrud(msgFiltro, this.objUsuario.idUsuario || 0).subscribe(
      x => {
        this.dataSource = new MatTableDataSource<Usuario>(x);
        this.dataSource.paginator = this.paginator
      }
    );
    console.log(">>> refreshTable [fin]");
  }

  updateDeEstado(obj: Prestatario) {
    console.log(">>> updateEstado [ini]");
    console.log("obj: ", obj);
    obj.estado = obj.estado == 1 ? 0 : 1;
    this.prestatarioService.actualizaPrestatarioCrud(obj).subscribe(
      x => {
        this.refreshTable();
      }
    );
    console.log(">>> updateEstado [fin]");
  }

  delete(obj: Prestatario) {
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
        this.prestatarioService.eliminarPrestatarioCrud(obj.idUsuario || 0).subscribe(
          x => {
            this.refreshTable();
            Swal.fire('Mensaje', x.mensaje, 'info');
          }
        );
      }
    })
  }
}
