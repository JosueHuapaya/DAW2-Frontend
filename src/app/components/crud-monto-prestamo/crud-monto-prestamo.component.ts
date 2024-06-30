import { Component, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MatPaginator } from '@angular/material/paginator';
import { Usuario } from '../../models/usuario.model';
import { MatDialog } from '@angular/material/dialog';
import { MontoPrestamoService } from '../../services/monto-prestamo.service';
import { TokenService } from '../../security/token.service';
import { MontoPrestamo } from '../../models/monto-prestamo.model';
import { MatTableDataSource } from '@angular/material/table';
import { CrudMontoPrestamoAgregarComponent } from '../crud-monto-prestamo-agregar/crud-monto-prestamo-agregar.component';
import { CrudMontoPrestamoActualizarComponent } from '../crud-monto-prestamo-actualizar/crud-monto-prestamo-actualizar.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crud-monto-prestamo',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-monto-prestamo.component.html',
  styleUrl: './crud-monto-prestamo.component.css'
})
export class CrudMontoPrestamoComponent {


  //Datos para la Grila
  dataSource:any;

  //Clase para la paginacion
  @ViewChild (MatPaginator, { static: true }) paginator!: MatPaginator;


  //Cabecera
   displayedColumns = ["idMontoPrestamo","capital","dias","monto","estado","acciones"];
   

   filtro: string = "";
   

   objUsuario: Usuario = {} ;


      constructor(private dialogService: MatDialog, 
        private montoService: MontoPrestamoService,
        private tokenService: TokenService ){
        this.objUsuario.idUsuario = tokenService.getUserId();
       
      }


      refreshTable(){
        console.log(">>> refreshTable [ini]");
        var msgFiltro = this.filtro == "" ? "todos":  this.filtro;
        this.montoService.consultarCrud(msgFiltro).subscribe(
              x => {
                this.dataSource = new MatTableDataSource<MontoPrestamo>(x);
                this.dataSource.paginator = this.paginator
              }
        );

        console.log(">>> refreshTable [fin]");
      }

      openDialogRegistra() {
        console.log(">>> openDialogRegistra [ini]");
        const dialogRef = this.dialogService.open(CrudMontoPrestamoAgregarComponent);
        dialogRef.afterClosed().subscribe(result => {
          console.log("Dialog result: ${result}");
            if (result != null && result === 1 ) {
                this.refreshTable();
            }
        });
        console.log(">>> openDialogRegistra [fin]");
        }
    
        
    
      openDialogActualiza(obj: MontoPrestamo) {
        console.log(">>> openDialogActualiza [ini]");
        const dialogRef = this.dialogService.open(CrudMontoPrestamoActualizarComponent , { data: obj });   
        dialogRef.afterClosed().subscribe(result => {
          console.log("Dialog result: ${result}");
          if (result != null && (result === 1 || result === 2)) {
            this.refreshTable();
        }
        });
        console.log(">>> openDialogActualiza [fin]");
      }

      updateEstado(obj: MontoPrestamo) {
        console.log(">>> updateEstado [ini]");
        console.log("obj: ", obj);
        obj.estado = obj.estado == 1 ? 0 : 1;      
        this.montoService.actualizarMonto(obj).subscribe(
          x => {
            this.refreshTable();
          }         
        );
        console.log(">>> updateEstado [fin]");
      }



      delete(obj: MontoPrestamo) {
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
                    this.montoService.eliminarCrud(obj.idMontoPrestamo || 0).subscribe(
                          x => {
                                this.refreshTable();
                                Swal.fire('Mensaje', x.mensaje, 'info');
                          }
                    );
                }
          })   
    }
}