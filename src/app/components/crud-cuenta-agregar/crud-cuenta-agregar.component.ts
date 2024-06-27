import { Component } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Cuenta } from '../../models/cuenta.model';
import { CuentaService } from '../../services/cuenta.service';
import { TokenService } from '../../security/token.service';
import { UtilService } from '../../services/util.service';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { EntidadFinanciera } from '../../models/entidad-financiera.model';
import { Data } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { map } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crud-cuenta-agregar',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './crud-cuenta-agregar.component.html',
  styleUrl: './crud-cuenta-agregar.component.css'
})
export class CrudCuentaAgregarComponent {

  constructor
  (
    private _cuentaService: CuentaService,
    private _tokenService: TokenService,
    private _utilService: UtilService,
    private _formBuilder: FormBuilder
  ){}

  ngOnInit() {
    this._utilService.listaTipoMoneda().subscribe(
      x =>
        this.tipoMoneda = x
    );

    this._utilService.listaTipoEntidadBancaria().subscribe(
      x =>
        this.tipoEntidadBancaria = x
    );

    this._cuentaService.listar(this.idTipoEntidad).subscribe(
      x => {
        this.tipoEntidad = x;
      }
    )


    this.objUsuario.idUsuario = this._tokenService.getUserId();

  }

  // Lista de Entidad Financiera
  tipoEntidad: EntidadFinanciera[] = [];

  // Lista de entidad bancaria
  tipoEntidadBancaria: DataCatalogo[] = [];

  // Lista de tipo de moneda
  tipoMoneda: DataCatalogo[] = [];

  // idTipoEntidad
  idTipoEntidad?: number = -1;

  // User
  objUsuario: Usuario = {};


  cuenta : Cuenta = {
    numero: "",
    entidadFinanciera:{
      idEntidadFinanciera:-1
    },
    tipoMoneda:{
      idDataCatalogo:-1
    },
    usuarioRegistro: {
      idUsuario: -1
    },
    usuarioActualiza: {
      idUsuario: -1
    },
  }


  formRegister = this._formBuilder.group({
    validateNro: ['', [Validators.required, Validators.pattern('[0-9]{20}')], this.validateNumber.bind(this)],
    validaTipoEntidad: ['', [Validators.min(1)]],
    validaEntidad: ['', [ Validators.min(1)]],
    validaMoneda: ['', [ Validators.min(1)]],
  })

  validateNumber(control: FormControl) {
    return this._cuentaService.validaNumeroRegistra(control.value).pipe(
      map((res : any) => {
        return (res.valid) ? null : {numero: true};
      })
    )
  }

  listarEntidadFinanciera(){
    this._cuentaService.listar(this.idTipoEntidad).subscribe(
      x => {
        this.tipoEntidad = x;
      }
    )
  }

  registrar() {
    this.cuenta.usuarioActualiza = this.objUsuario;
    this.cuenta.usuarioRegistro = this.objUsuario;

    this._cuentaService.registrar(this.cuenta).subscribe(
      x=>{
            Swal.fire(
              {
              icon: 'success',
              title: 'Resultado del Registro',
              text: x.mensaje
              }
            );
            this.cuenta = {
              numero: "",
              entidadFinanciera:{
                idEntidadFinanciera:-1
              },
              tipoMoneda:{
                idDataCatalogo:-1
              },
              usuarioRegistro: {
                idUsuario: -1
              },
              usuarioActualiza: {
                idUsuario: -1
             },
            };
            this.idTipoEntidad = -1;
        });
  }

}
