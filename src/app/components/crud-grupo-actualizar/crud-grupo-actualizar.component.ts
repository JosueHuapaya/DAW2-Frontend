import { Component, Inject } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Ubigeo } from '../../models/ubigeo.model';
import { Usuario } from '../../models/usuario.model';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { GrupoService } from '../../services/grupo.service';
import { Grupo } from '../../models/grupo.model';
import Swal from 'sweetalert2';
import { map } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-crud-grupo-actualizar',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-grupo-actualizar.component.html',
  styleUrl: './crud-grupo-actualizar.component.css'
})
export class CrudGrupoActualizarComponent {

  objGrupo: Grupo ={
    descripcion: "",
    ubigeo:{
      idUbigeo:-1,
      departamento:"-1",
      provincia:"-1",
      distrito:"",
    },
    usuarioLider:{
      idUsuario:-1
    },
    usuarioRegistro: {
      idUsuario: -1
    },
  usuarioActualiza: {
      idUsuario: -1
    },  
}

//listas de ubigeo 
departamentos : string[] = [];
provincias : string[] = [];
distritos: Ubigeo[] = [];

//Lista Usuario Lider
lstUsuarioLider: Usuario[] = [];
 
//Usuario en Sesion  
objUsuario: Usuario = {} ;

formsRegistra = this.formBuilder.group({ 
  validaNombre: ['', [Validators.required, Validators.pattern('[a-zA-Zá-úÁ-ÚñÑ ]{3,30}')]] ,  
  validaDepartamento: ['', Validators.min(1)],
  validaProvincia: ['', Validators.min(1)],
  validaDistrito: ['', Validators.min(1)],
  validaLider: ['', Validators.min(1)],
});

constructor(private utilService: UtilService, 
  private tokenService: TokenService,
  private grupoService: GrupoService,
  private formBuilder: FormBuilder,
  @Inject(MAT_DIALOG_DATA) public data: Grupo){

    this.objGrupo = data;

    console.log(">>> constructor  >>> ");
}

ngOnInit() {
  console.log(">>> OnInit [inicio]");
this.utilService.listarDepartamento().subscribe(
  x => this.departamentos = x
);
//Cargar las provincias y distritos [inicio]
this.utilService.listaProvincias(this.objGrupo.ubigeo?.departamento).subscribe(
  x => this.provincias = x
);
this.utilService.listaDistritos(this.objGrupo.ubigeo?.departamento,this.objGrupo.ubigeo?.provincia).subscribe(
  x => this.distritos = x
);
//Cargar las provincias y distritos [fin]

this.utilService.listaJefePrestamistaTotales().subscribe(
  x => this.lstUsuarioLider = x
);
this.objUsuario.idUsuario = this.tokenService.getUserId();
console.log(">>> OnInit >>> " + this.departamentos);
console.log(">>> OnInit >>> " + this.lstUsuarioLider);
console.log(">>> OnInit [fin]");      
}

actualiza() {
  console.log(">>> actualiza [inicio]");
  this.objGrupo.usuarioActualiza = this.objUsuario;
  this.objGrupo.usuarioRegistro = this.objUsuario;
  console.log(">>> actualiza [inicio] ", this.objGrupo);


  this.grupoService.actualizarCrud(this.objGrupo).subscribe(
    x=>{
          Swal.fire({ icon: 'info', title: 'Resultado del Registro', text: x.mensaje, });
          this.objGrupo ={
            descripcion: "",
            ubigeo:{
              idUbigeo:-1,
              departamento:"-1",
              provincia:"-1",
              distrito:"",
            },
            usuarioLider:{
              idUsuario:-1
            },
            usuarioRegistro: {
              idUsuario: -1
            },
            usuarioActualiza: {
              idUsuario: -1
            }, 
          };
      }
  );
}

validaDescripcion(control: FormControl) {
  console.log(">>> validaDescripcion [inicio] " + control.value);
  
   return this.grupoService.validaDescripcionRegistra(control.value).pipe(
     map((resp: any) => { 
          console.log(">>> validaDescripcion [resp] " + resp.valid);
          return (resp.valid) ? null : {existeDescripcion: true} ;    
        })
    );
}

 listaProvincia(){
  console.log("listaProvincia>>> " + this.objGrupo.ubigeo?.departamento);
  this.utilService.listaProvincias(this.objGrupo.ubigeo?.departamento).subscribe(
      x => this.provincias = x
  );
}

listaDistrito(){
  console.log("listaDistrito>>> " + this.objGrupo.ubigeo?.departamento);
  console.log("listaDistrito>>> " + this.objGrupo.ubigeo?.provincia);
  this.utilService.listaDistritos(this.objGrupo.ubigeo?.departamento,this.objGrupo.ubigeo?.provincia).subscribe(
      x => this.distritos = x
  );
}

salir() {
  
}



}
