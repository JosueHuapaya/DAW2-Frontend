import { Component, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MatPaginator } from '@angular/material/paginator';
import { Usuario } from '../../models/usuario.model';
import { CoordenadaService } from '../../services/coordenada.service';
import { TokenService } from '../../security/token.service';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-consulta-coordenada',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './consulta-coordenada.component.html',
  styleUrl: './consulta-coordenada.component.css'
})

export class ConsultaCoordenadaComponent {

  dataSource: any;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  displayedColumns: string[] = ['idCoordenada', 'prestatario', 'latitud', 'longitud', 'ubigeo', 'fechaRegistro', 'fechaActualizacion', 'estado', 'acciones'];

  departamentos: string[] = [];
  seleccionaDepartamento: string = '';

  latitud: number = 0;
  longitud: number = 0;

  objUsuario: Usuario = {};


  constructor(
    private coordenadaService: CoordenadaService,
    private utilService: UtilService,
    private tokenService: TokenService) {
    this.objUsuario.idUsuario = this.tokenService.getUserId();
  }

  ngOnInit() {

    this.utilService.listarDepartamento().subscribe(
      x => this.departamentos = x
    );
    this.objUsuario.idUsuario = this.tokenService.getUserId();
  }

  consultarCoordenadaComplet() {

    this.coordenadaService.consultarCoordenadaCompleta(this.latitud, this.longitud, this.seleccionaDepartamento).subscribe(
      data => {

        this.dataSource = data;
        this.dataSource.paginator = this.paginator;

      }
    )

  }

  seleccionarDepartamento(event: any) {
    this.seleccionaDepartamento = event.value;
    console.log("Departamento seleccionado: ", this.seleccionaDepartamento);
  }



}
