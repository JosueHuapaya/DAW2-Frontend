import { Component, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MatPaginator } from '@angular/material/paginator';
import { Usuario } from '../../models/usuario.model';
import { MatDialog } from '@angular/material/dialog';
import { CoordenadaService } from '../../services/coordenada.service';
import { TokenService } from '../../security/token.service';
import { MatTableDataSource } from '@angular/material/table';
import { Coordenada } from '../../models/coordenada.model';
import { CrudCoordenadaAgregarComponent } from '../crud-coordenada-agregar/crud-coordenada-agregar.component';
import { CrudCoordenadaActualizarComponent } from '../crud-coordenada-actualizar/crud-coordenada-actualizar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crud-coordenada',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-coordenada.component.html',
  styleUrl: './crud-coordenada.component.css'
})

export class CrudCoordenadaComponent {

  dataSource: any;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  displayedColumns: string[] = ['idCoordenada', 'prestatario', 'latitud', 'longitud', 'ubigeo', 'fechaRegistro', 'fechaActualizacion', 'estado', 'acciones'];

  filtro: string = '';

  objUsuario: Usuario = {};
  latitud!: number;
  listadoCoordenadas: Coordenada[] = [];

  constructor(private dialogService: MatDialog,
    private coordenadaService: CoordenadaService,
    private tokenService: TokenService) {
    this.objUsuario.idUsuario = this.tokenService.getUserId();
  }

  openDialogDeRegistrar() {
    const dialogRef = this.dialogService.open(CrudCoordenadaAgregarComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      if (result != null && result === 1) {
        this.refreshTable();
      }
    });
  }

  openDialogDeActualizar(obj: Coordenada) {
    console.log(">>> openDialogActualizar [ini]");
    console.log("obj: ", obj);
    const dialogRef = this.dialogService.open(CrudCoordenadaActualizarComponent, { data: obj });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      if (result != null && (result === 1 || result === 2)) {
        this.refreshTable();
      }
    });
  }

  refreshTable() {

    var msgFiltro = this.filtro == "" ? "todos" : this.filtro;
    this.coordenadaService.consultarCoordenada(msgFiltro).subscribe(
      x => {
        this.dataSource = new MatTableDataSource<Coordenada>(x);
        this.dataSource.paginator = this.paginator
      }
    );

  }
  updateDeEstado(obj: Coordenada) {
    obj.estado = obj.estado === 1 ? 0 : 1;
    this.coordenadaService.actualizarCoordenada(obj).subscribe(
      x => {
        console.log('Estado actualizado', x);
        this.refreshTable();
        Swal.fire('Estado actualizado', 'El estado de la coordenada ha sido actualizado.', 'success');
      },
      error => {
        console.error('Error actualizando estado', error);
        Swal.fire('Error', 'No se pudo actualizar el estado de la coordenada.', 'error');
      }
    );
  }


  delete(obj: Coordenada) {
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
        this.coordenadaService.eliminarCoordenada(obj.idCoordenada || 0).subscribe(
          x => {
            this.refreshTable();
            Swal.fire('Mensaje', x.mensaje, 'info');
          }
        );
      }
    })
  }

}
