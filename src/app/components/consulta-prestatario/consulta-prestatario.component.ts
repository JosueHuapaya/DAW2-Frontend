import { Component, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MatPaginator } from '@angular/material/paginator';
import { PrestatarioService } from '../../services/prestatario.service';
import { MatTableDataSource } from '@angular/material/table';
import { Prestatario } from '../../models/prestatario.model';
import { Usuario } from '../../models/usuario.model';
import { TokenService } from '../../security/token.service';

@Component({
  selector: 'app-consulta-prestatario',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './consulta-prestatario.component.html',
  styleUrl: './consulta-prestatario.component.css'
})
export class ConsultaPrestatarioComponent {

  dataSource: any;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  displayedColumns = ["idUsuario", "nombres", "apellidos", "dni", "login", "correo", "fechaNacimiento", "direccion", "estado"];

  nombres: string = "";
  apellidos: string = "";
  direccion: string = "";
  dni: string = "";

  objUsuario: Usuario = {};

  constructor(private prestatarioService: PrestatarioService,
    private tokenService: TokenService) {
    this.objUsuario.idUsuario = tokenService.getUserId();
  }

  consultaPrestatarioCompleja() {

    this.prestatarioService.consultaPrestatarioCompleja(this.nombres, this.apellidos, this.dni, this.direccion).subscribe(
      x => {
        this.dataSource = new MatTableDataSource<Prestatario>(x);
        this.dataSource.paginator = this.paginator
      }
    );
  }

}
