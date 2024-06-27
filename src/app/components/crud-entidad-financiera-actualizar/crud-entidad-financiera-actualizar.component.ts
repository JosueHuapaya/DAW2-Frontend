import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuComponent } from '../../menu/menu.component';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../../app.material.module';
import { EntidadFinanciera } from '../../models/entidad-financiera.model';
import { Usuario } from '../../models/usuario.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { Ubigeo } from '../../models/ubigeo.model';
import { EntidadFinancieraService } from '../../services/entidad-financiera.service';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pais } from '../../models/pais.model';
import Swal from 'sweetalert2';
import { map } from 'rxjs';
@Component({
  selector: 'app-crud-entidad-financiera-actualizar',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-entidad-financiera-actualizar.component.html',
  styleUrl: './crud-entidad-financiera-actualizar.component.css'
})
export class CrudEntidadFinancieraActualizarComponent {
  entidadFinanciera:EntidadFinanciera = {
    nombre: "",
    gerente: "",
    tipoEntidad: {
      idDataCatalogo: -1
    },
    ubigeo: {
      idUbigeo: -1,
      departamento:"-1",
      provincia:"-1",
      distrito:"",
    },
    usuarioRegistro: {
      idUsuario: -1
    },
    usuarioActualiza: {
      idUsuario: -1
    }
  }
  formRegistrar = this.formBuilder.group ({
    validaNombre: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{5,20}')], this.validaNombre.bind(this)],
    validaGerente: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{5,45}')]],
    validaTipo: ['', [Validators.min(1)]],
    validaDepartamento: ['', [Validators.min(1)]],
    validaProvincia: ['', [Validators.min(1)]],
    validaDistrito: ['', [Validators.min(1)]]
  });
  objUsuario:Usuario ={};
  listaTipo:DataCatalogo[] = [];
  lstPais: Pais[] = [];
  departamento: string[] = [];
  provincia: string[] = [];
  distrito: Ubigeo[] = [];
  constructor(private entidadService: EntidadFinancieraService,
    private utilService: UtilService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: EntidadFinanciera) {
    
    
    this.entidadFinanciera = data;

console.log(">>> constructor  >>> ");
}
ngOnInit() {
  console.log(">>> OnInit [inicio]");
this.utilService.listaPais().subscribe(
  x => this.lstPais = x
);
this.utilService.listarDepartamento().subscribe(
  x => this.departamento = x
);
this.utilService.listaProvincias(this.entidadFinanciera.ubigeo?.departamento).subscribe(
x => this.provincia = x
);
this.utilService.listaDistritos(this.entidadFinanciera.ubigeo?.departamento,this.entidadFinanciera.ubigeo?.provincia).subscribe(
x => this.distrito = x
);
this.utilService.listaTipoEntidadBancaria().subscribe(
  x => this.listaTipo = x
)
this.objUsuario.idUsuario = this.tokenService.getUserId();
console.log(">>> OnInit >>> 1 >> " + this.lstPais.length);
console.log(">>> OnInit >>> " + this.departamento);
console.log(">>> OnInit [fin]");      
}
listaProvincia(){
  console.log("listaProvincia>>> " + this.entidadFinanciera.ubigeo?.departamento);
  this.utilService.listaProvincias(this.entidadFinanciera.ubigeo?.departamento).subscribe(
      x => this.provincia = x
  );
}
listaDistrito(){
  console.log("listaDistrito>>> " + this.entidadFinanciera.ubigeo?.departamento);
  console.log("listaDistrito>>> " + this.entidadFinanciera.ubigeo?.provincia);
  this.utilService.listaDistritos(this.entidadFinanciera.ubigeo?.departamento,this.entidadFinanciera.ubigeo?.provincia).subscribe(
      x => this.distrito = x
  );
}
actualiza(){
  console.log(">> registro [Inicio]");
  this.entidadFinanciera.usuarioRegistro = this.objUsuario;
  this.entidadFinanciera.usuarioActualiza = this.objUsuario;
  console.log(">> registro [Inicio] "+this.entidadFinanciera);
  console.log(this.entidadFinanciera);

  this.entidadService.actualizaCrudEntidad(this.entidadFinanciera).subscribe(
    x => {
      Swal.fire({icon: 'info', title:'Resultado', text:x.mensaje, });
      this.entidadFinanciera = {
        nombre: "",
        gerente: "",
        tipoEntidad: {
          idDataCatalogo: -1
        },
        ubigeo: {
          idUbigeo: -1,
          departamento:"-1",
          provincia:"-1",
          distrito:"",
        },
        usuarioRegistro: {
          idUsuario: -1
        },
        usuarioActualiza: {
          idUsuario: -1
        }
      }
    });
}
validaNombre(control: FormControl) {
  console.log(">>> validaNombre [inicio] " + control.value);
  return this.entidadService.validacionNombreActualiza(control.value, this.entidadFinanciera.idEntidadFinanciera || 0).pipe(
     map((resp: any) => { 
          console.log(">>> validaNombre [resp] " + resp.valid);
          return (resp.valid) ? null : {existeNombre: true} ;    
        })
    );
}
salir() {
        
}
}