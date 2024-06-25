import { Component } from '@angular/core';
import { Validators, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoordenadaService } from '../../services/coordenada.service';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { Ubigeo } from '../../models/ubigeo.model';
import { Usuario } from '../../models/usuario.model';
import Swal from 'sweetalert2';
import { Coordenada } from '../../models/coordenada.model';
import { AppMaterialModule } from '../../app.material.module';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-crud-coordenada-agregar',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-coordenada-agregar.component.html',
  styleUrls: ['./crud-coordenada-agregar.component.css']
})
export class CrudCoordenadaAgregarComponent {

  coordenada: Coordenada = {
    prestatario: {
      idUsuario: -1
    },
    latitud: null,
    longitud: null,
    ubigeo: {
      idUbigeo: -1,
      departamento: "-1",
      provincia: "-1",
      distrito: ""
    },
    usuarioRegistro: {
      idUsuario: -1
    },
    usuarioActualiza: {
      idUsuario: -1
    },
  };

  constructor(private formBuilder: FormBuilder,
    private coordenadaService: CoordenadaService,
    private utilService: UtilService,
    private tokenService: TokenService,
    private dialogRef: MatDialogRef<CrudCoordenadaAgregarComponent>) { }

  formRegistrar = this.formBuilder.group({
    validaLatitud: ['', [Validators.required, Validators.min(1), Validators.pattern('(([0-9]{1,})|([0-9]{1,}.[0-9]{1,3}))')]],
    validaLongitud: ['', [Validators.required, Validators.min(1), Validators.pattern('(([0-9]{1,})|([0-9]{1,}.[0-9]{1,3}))')]],
    validaDepartamento: ['', [Validators.min(1)]],
    validaProvincia: ['', [Validators.min(1)]],
    validaDistrito: ['', [Validators.min(1)]],
    validaPrestatario: ['', [Validators.min(1)]],
  });

  departamentos: string[] = [];
  provincias: string[] = [];
  distritos: Ubigeo[] = [];
  lstPrestatarios: Usuario[] = [];

  objUsuario: Usuario = {};

  ngOnInit() {
    this.utilService.listarDepartamento().subscribe(
      x => this.departamentos = x
    );

    this.objUsuario.idUsuario = this.tokenService.getUserId();

    this.coordenadaService.listaPrestamistariosTotales().subscribe(
      x => this.lstPrestatarios = x
    );
  }

  registrar() {
    this.coordenada.usuarioActualiza = this.objUsuario;
    this.coordenada.usuarioRegistro = this.objUsuario;

    this.coordenadaService.registrar(this.coordenada).subscribe(
      x => {
        Swal.fire({ icon: 'info', title: 'Coordenada registrada', text: x.mensaje });
        this.dialogRef.close(1);
      },
      error => {
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo registrar la coordenada' });
        this.dialogRef.close(2);
      }
    );
  }

  cancelar() {
    this.dialogRef.close();
  }

  listaProvincia() {
    this.utilService.listaProvincias(this.coordenada.ubigeo?.departamento).subscribe(
      x => this.provincias = x
    );
  }

  listaDistrito() {
    this.utilService.listaDistritos(this.coordenada.ubigeo?.departamento, this.coordenada.ubigeo?.provincia).subscribe(
      x => this.distritos = x
    );
  }
}
