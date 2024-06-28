import { Component, Inject } from '@angular/core';
import { EntidadFinanciera } from '../../models/entidad-financiera.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { CuentaService } from '../../services/cuenta.service';
import { TokenService } from '../../security/token.service';
import { UtilService } from '../../services/util.service';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';
import { Cuenta } from '../../models/cuenta.model';
import { map } from 'rxjs';
import Swal from 'sweetalert2';
import { AppMaterialModule } from '../../app.material.module';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-crud-cuenta-actualizar',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './crud-cuenta-actualizar.component.html',
  styleUrl: './crud-cuenta-actualizar.component.css'
})
export class CrudCuentaActualizarComponent {

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

  // Catalogo
  catalogo? : number = -1


  constructor
  (
    private _cuentaService: CuentaService,
    private _tokenService: TokenService,
    private _utilService: UtilService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Cuenta
  ){
    this.cuenta = data
  }

  ngOnInit() {
    this._utilService.listaTipoMoneda().subscribe(
      x =>
        this.tipoMoneda = x
    );

    if(this.cuenta.entidadFinanciera?.tipoEntidad?.idDataCatalogo !== -1) {
      this._utilService.listaTipoEntidadBancaria().subscribe(
        x => {
          this.tipoEntidadBancaria = x
        }
      );
    }

    this.catalogo = this.cuenta.entidadFinanciera?.tipoEntidad?.idDataCatalogo;

    this.listarEntidadFinanciera();

    this.objUsuario.idUsuario = this._tokenService.getUserId();
  }


  formRegister = this._formBuilder.group({
    validateNumber: ['', [Validators.required, Validators.pattern('[0-9]{20}')], this.validateNumber.bind(this), this.validateNumberRegister.bind(this)],
    validaTipoEntidad: ['', [Validators.min(1)]],
    validaEntidad: ['', [ Validators.min(1)]],
    validaMoneda: ['', [ Validators.min(1)]],
  })

  validateNumber(control: FormControl) {
    return this._cuentaService.validaNumeroActualiza(control.value, this.cuenta.idCuenta || 0).pipe(
      map((res : any) => {
        return (res.valid) ? null : {exisnumero: true};
      })
    )
  }

  validateNumberRegister(control: FormControl) {
    return this._cuentaService.validaNumeroRegistra(control.value).pipe(
      map((res : any) => {
        return (res.valid) ? null : {exnumero: true};
      })
    )
  }

  listarEntidadFinanciera(){
    if(this.cuenta.entidadFinanciera?.tipoEntidad?.idDataCatalogo === this.catalogo){
      this._cuentaService.listar(this.cuenta.entidadFinanciera!.tipoEntidad!.idDataCatalogo).subscribe(
        x => {
          this.tipoEntidad = x
        }
      )
    }else{
      this.cuenta.entidadFinanciera!.idEntidadFinanciera = -1;
      this._cuentaService.listar(this.cuenta.entidadFinanciera!.tipoEntidad!.idDataCatalogo).subscribe(
        x => {
          this.tipoEntidad = x
        }
      )
    }
  }


  update() {
    this.cuenta.usuarioActualiza = this.objUsuario;
    this.cuenta.usuarioRegistro = this.objUsuario;

    this._cuentaService.update(this.cuenta).subscribe(
      x => {
          Swal.fire({
            icon : 'info',
            title : 'Resultado de actualizacion',
            text : x.mensaje
          });
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
      }
    )
  }




}
