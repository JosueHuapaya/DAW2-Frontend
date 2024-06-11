import { Component } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Cuenta } from '../../models/cuenta.model';
import { map } from 'rxjs';
import { EntidadFinanciera } from '../../models/entidad-financiera.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { Usuario } from '../../models/usuario.model';
import { CuentaService } from '../../services/cuenta.service';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-agregar-cuenta',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './agregar-cuenta.component.html',
  styleUrl: './agregar-cuenta.component.css'
})

export class AgregarCuentaComponent {

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

formRegistrar = this.formBuilder.group({
  validaNumero: ['', [Validators.required, Validators.pattern('[0-9]{20}')], this.validaNumero.bind(this)],
  validaTipoEntidad: ['', [Validators.min(1)]],
  validaEntidad: ['', [ Validators.min(1)]],
  validaMoneda: ['', [ Validators.min(1)]],
});

validaNumero(control: FormControl) {
  console.log(">>> validaNumero [inicio] " + control.value);

   return this.cuentaService.validaNumeroRegistra(control.value).pipe(
     map((resp: any) => {
          console.log(">>> validaNumero [resp] " + resp.valid);
          return (resp.valid) ? null : {existeNumero: true} ;
        })
    );
}

lstEntidadFinanciera: EntidadFinanciera[] = [];
lstTipoEntidadBancaria: DataCatalogo[] = [];
lstTipoMoneda: DataCatalogo [] = [];
idTipoEntidad?: Number = -1;

objUsuario: Usuario = {};

constructor(
  private cuentaService: CuentaService,
  private formBuilder : FormBuilder,
  private utilService: UtilService,
  private tokenService: TokenService ) {
console.log(">>> constructor  >>> ");
}

//
ngOnInit() {
  console.log(">>> OnInit [inicio]");

  this.utilService.listaTipoMoneda().subscribe(
    x => this.lstTipoMoneda = x
  );

  this.utilService.listaTipoEntidadBancaria().subscribe(
    x => this.lstTipoEntidadBancaria = x
  );

  this.objUsuario.idUsuario = this.tokenService.getUserId();

}

listarEntidadFinanciera(){
  console.log(">>> codigo del tipo de entidad >>>" + this.idTipoEntidad)
  this.cuentaService.listar(this.idTipoEntidad).subscribe(
    (x) =>{
      this.lstEntidadFinanciera = x;
    x.forEach(entidad => {

      console.log(">>> entidades financieras >>>" + entidad.nombre)
    })
    }
  )
}

registra() {
  console.log(">>> registra [inicio]");
  this.cuenta.usuarioActualiza = this.objUsuario;
  this.cuenta.usuarioRegistro = this.objUsuario;
  console.log(">>> registra [inicio] " + this.cuenta);
  console.log(this.cuenta);


  this.cuentaService.registrar(this.cuenta).subscribe(
    x=>{
          Swal.fire({ icon: 'info', title: 'Resultado del Registro', text: x.mensaje, });
          this.cuenta ={
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
      }
  );
}
}
