import { Component, Inject, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import Swal from 'sweetalert2';
import { Coordenada } from '../../models/coordenada.model';
import { CoordenadaService } from '../../services/coordenada.service';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Ubigeo } from '../../models/ubigeo.model';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-crud-coordenada-actualizar',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-coordenada-actualizar.component.html',
  styleUrls: ['./crud-coordenada-actualizar.component.css']
})
export class CrudCoordenadaActualizarComponent implements OnInit {

  coordenada: Coordenada;

  departamentos: string[] = [];
  provincias: string[] = [];
  distritos: Ubigeo[] = [];
  lstPrestatarios: Usuario[] = [];

  objUsuario: Usuario = {};

  formRegistrar = this.formBuilder.group({
    validaLatitud: ['', [Validators.required, Validators.min(1), Validators.pattern('(([0-9]{1,})|([0-9]{1,}.[0-9]{1,3}))')]],
    validaLongitud: ['', [Validators.required, Validators.min(1), Validators.pattern('(([0-9]{1,})|([0-9]{1,}.[0-9]{1,3}))')]],
    validaDepartamento: ['', [Validators.min(1)]],
    validaProvincia: ['', [Validators.min(1)]],
    validaDistrito: ['', [Validators.min(1)]],
    validaPrestatario: ['', [Validators.min(1)]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private coordenadaService: CoordenadaService,
    private utilService: UtilService,
    private tokenService: TokenService,
    private dialogRef: MatDialogRef<CrudCoordenadaActualizarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Coordenada) {

    this.coordenada = data;
    if (!this.coordenada.prestatario) {
      this.coordenada.prestatario = { idUsuario: -1 };
    }
    if (!this.coordenada.ubigeo) {
      this.coordenada.ubigeo = { idUbigeo: -1, departamento: "-1", provincia: "-1", distrito: "" };
    }
  }

  ngOnInit() {
    this.utilService.listarDepartamento().subscribe(
      x => {
        this.departamentos = x;
        this.loadProvinciasYDistritos();
      }
    );

    this.objUsuario.idUsuario = this.tokenService.getUserId();

    this.coordenadaService.listaPrestamistariosTotales().subscribe(
      x => this.lstPrestatarios = x
    );
  }

  loadProvinciasYDistritos() {
    if (this.coordenada.ubigeo!.departamento && this.coordenada.ubigeo!.departamento !== "-1") {
      this.listaProvincia();
    }

    if (this.coordenada.ubigeo!.provincia && this.coordenada.ubigeo!.provincia !== "-1") {
      this.listaDistrito();
    }
  }

  actualizarCoordenadas() {
    this.coordenada.usuarioActualiza = this.objUsuario;

    this.coordenadaService.actualizarCoordenada(this.coordenada).subscribe(
      x => {
        Swal.fire({ icon: 'info', title: 'Coordenada Actualizada', text: 'La coordenada se ha actualizado correctamente' });
        this.dialogRef.close(1);
      },
      error => {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar la coordenada' });
        this.dialogRef.close(2);
      }
    );
  }

  listaProvincia() {
    this.utilService.listaProvincias(this.coordenada.ubigeo!.departamento).subscribe(
      x => {
        this.provincias = x;
        if (this.coordenada.ubigeo!.provincia && this.coordenada.ubigeo!.provincia !== "-1") {
          this.listaDistrito();
        }
      }
    );
  }

  listaDistrito() {
    this.utilService.listaDistritos(this.coordenada.ubigeo!.departamento, this.coordenada.ubigeo!.provincia).subscribe(
      x => this.distritos = x
    );
  }

  cancelar() {
    this.dialogRef.close();
  }
}
