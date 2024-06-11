import { Component } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validator, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { EntidadFinanciera } from '../../models/entidad-financiera.model';
import { EntidadFinancieraService } from '../../services/entidad-financiera.service';
import { TokenService } from '../../security/token.service';
import { Usuario } from '../../models/usuario.model';
import { Ubigeo } from '../../models/ubigeo.model';
import { UtilService } from '../../services/util.service';
import { map } from 'rxjs';
import Swal from 'sweetalert2';
import { DataCatalogo } from '../../models/dataCatalogo.model';


@Component({
  selector: 'app-agregar-entidad-financiera',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './agregar-entidad-financiera.component.html',
  styleUrl: './agregar-entidad-financiera.component.css'
})
export class AgregarEntidadFinancieraComponent {

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

  depatarmento: string[] = [];
  provincia: string[] = [];
  distrito: Ubigeo[] = [];

  constructor(private entidadFinancieraService: EntidadFinancieraService,
              private utilService: UtilService,
              private tokenService: TokenService,
              private formBuilder:FormBuilder){
                console.log(">> Constructor >>")
              }

  ngOnInit(){
    console.log(">> OnInit [Inicio]");
    this.utilService.listarDepartamento().subscribe(
      x => this.depatarmento = x
    )
    this.utilService.listaTipoEntidadBancaria().subscribe(
      x => this.listaTipo = x
    )
    this.objUsuario.idUsuario = this.tokenService.getUserId();
    console.log(">> OnInit >> "+this.depatarmento);
    console.log(">> OnInit [Fin]");
  }

  validaNombre(control:FormControl){
    console.log(">> ValidaNombre [Inicio] "+control.value);
    return this.entidadFinancieraService.validacionNombre(control.value).pipe(
      map((resp:any) =>{
        console.log(">> ValidaNombre [resp] "+resp.valid);
        return (resp.valid) ? null : {existeNombre: true};
      })
    );
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

  registro(){
    console.log(">> registro [Inicio]");
    this.entidadFinanciera.usuarioRegistro = this.objUsuario;
    this.entidadFinanciera.usuarioActualiza = this.objUsuario;
    console.log(">> registro [Inicio] "+this.entidadFinanciera);
    console.log(this.entidadFinanciera);

    this.entidadFinancieraService.registro(this.entidadFinanciera).subscribe(
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

}
