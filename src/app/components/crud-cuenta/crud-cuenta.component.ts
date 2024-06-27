import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Usuario } from '../../models/usuario.model';
import { MatDialog } from '@angular/material/dialog';
import { CuentaService } from '../../services/cuenta.service';
import { TokenService } from '../../security/token.service';
import { CrudCuentaAgregarComponent } from '../crud-cuenta-agregar/crud-cuenta-agregar.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Cuenta } from '../../models/cuenta.model';
import { CrudCuentaActualizarComponent } from '../crud-cuenta-actualizar/crud-cuenta-actualizar.component';
import Swal from 'sweetalert2';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';

@Component({
  selector: 'app-crud-cuenta',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-cuenta.component.html',
  styleUrl: './crud-cuenta.component.css'
})
export class CrudCuentaComponent {

  // Data
  data: any;

  // Paginator
  @ViewChild (MatPaginator, {static: true}) paginator!: MatPaginator;

  // Header
  columns = ["idCuenta", "numero", "entidad", "moneda", "estado", "acciones"]

  // Filter
  filter: string = "";

  // Objuser
  objUsuario: Usuario = {};

  constructor(private _dialogService: MatDialog,
              private _cuentaService: CuentaService,
              private _tokenService: TokenService){
    this.objUsuario = this._tokenService.getUserId();
  }

  openDialogRegister() {
    const dialog = this._dialogService.open(CrudCuentaAgregarComponent);
    dialog.afterClosed().subscribe(response => {
      if (response !== '' && (response === 1 || response === 2)) {
        this.refresh();
      }
    });
  }

  openDialogUpdate(cuenta: Cuenta) {
    const dialog = this._dialogService.open(CrudCuentaActualizarComponent, {data: cuenta});
    dialog.afterClosed().subscribe(response => {
      if (response != null && (response === 1 || response === 2)) {
        this.refresh();
  }
    });
    console.log(cuenta);
  }

  updateEstado(cuenta: Cuenta) {
    cuenta.estado = cuenta.estado == 1 ? 0 : 1;
    this._cuentaService.update(cuenta).subscribe(
      x => {
        this.refresh();
      });
  }

  delete(cuenta: Cuenta) {
    Swal.fire({
      title: '¿Desea eliminar esta cuenta?',
      text: "Esta accion es irreversible",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    })
    .then(result => {
      if (result.isConfirmed) {
        this._cuentaService.delete(cuenta.idCuenta || 0).subscribe(
          x => {
            this.refresh();
            Swal.fire('Mensaje', x.mensaje, 'success');
          }
        )
      }
    })
  }

  refresh() {
    let filter = this.filter == "" ? "lista": this.filter;
    this._cuentaService.consultar(filter).subscribe(
      x => {
        this.data = new MatTableDataSource<Cuenta>(x)
        this.data.paginator = this.paginator;
        console.log(this.data)
      });
  }


}
