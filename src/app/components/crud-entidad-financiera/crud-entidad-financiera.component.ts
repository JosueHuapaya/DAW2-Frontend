import { Component, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MatPaginator } from '@angular/material/paginator';
import { Usuario } from '../../models/usuario.model';
import { EntidadFinancieraService } from '../../services/entidad-financiera.service';
import { MatDialog } from '@angular/material/dialog';
import { TokenService } from '../../security/token.service';
import { CrudEntidadFinancieraAgregarComponent } from '../crud-entidad-financiera-agregar/crud-entidad-financiera-agregar.component';
import { EntidadFinanciera } from '../../models/entidad-financiera.model';
import { CrudEntidadFinancieraActualizarComponent } from '../crud-entidad-financiera-actualizar/crud-entidad-financiera-actualizar.component';
import { MatTableDataSource } from '@angular/material/table';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-crud-entidad-financiera',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-entidad-financiera.component.html',
  styleUrl: './crud-entidad-financiera.component.css'
})
export class CrudEntidadFinancieraComponent {

  dataSource: any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  displayedColumns = ["idEntidadFinanciera", "nombre", "gerente", "tipoEntidad", "ubigeo", "estado", "acciones"];
  filter: string = "";
  listaTipo: DataCatalogo[] = [];
  beanUsuario: Usuario = {};

  constructor(private dialogService: MatDialog,
    private utilService: UtilService,
    private entidadService: EntidadFinancieraService,
    private tokenService: TokenService) {
    this.beanUsuario.idUsuario = tokenService.getUserId();
  }

  ngOnInit() {

    this.utilService.listaTipoEntidadBancaria().subscribe(
      x => this.listaTipo = x
    )

  }

  openElRegistrar() {

    const dialogRef = this.dialogService.open(CrudEntidadFinancieraAgregarComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      if (result != null && result === 1) {
        this.refrescarTabla();
      }
    });

  }

  openElActualizar(obj: EntidadFinanciera) {

    const dialogRef = this.dialogService.open(CrudEntidadFinancieraActualizarComponent, { data: obj });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      if (result != null && (result === 1 || result === 2)) {
        this.refrescarTabla();
      }
    });

  }

  refrescarTabla() {

    var msgFiltro = this.filter == "" ? "0" : this.filter;
    this.entidadService.consultarCrudEntidad(msgFiltro).subscribe(
      x => {
        this.dataSource = new MatTableDataSource<EntidadFinanciera>(x);
        this.dataSource.paginator = this.paginator
      }
    );

  }

  updateDeEstado(obj: EntidadFinanciera) {

    obj.estado = obj.estado == 1 ? 0 : 1;
    this.entidadService.actualizaCrudEntidad(obj).subscribe(
      x => {
        this.refrescarTabla();
      }
    );

  }

  delete(obj: EntidadFinanciera) {
    Swal.fire({
      title: '¿Desea eliminar?',
      text: "Los cambios no se van a revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.entidadService.eliminarCrudEntidad(obj.idEntidadFinanciera || 0).subscribe(
          x => {
            this.refrescarTabla();
            Swal.fire('Mensaje', x.mensaje, 'info');
          }
        );
      }
    })
  }
}
