import { Component, OnInit } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { Prestatario } from '../../models/prestatario.model';
import { PrestatarioService } from '../../services/prestatario.service';
import Swal from 'sweetalert2';
import { TokenService } from '../../security/token.service';
import { Usuario } from '../../models/usuario.model';
import { map } from 'rxjs';


@Component({
  selector: 'app-agregar-prestatario',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './agregar-prestatario.component.html',
  styleUrl: './agregar-prestatario.component.css'
})
export class AgregarPrestatarioComponent {

    prestatario: Prestatario ={
      nombres:'',
      apellidos:'',
      dni:'',
      login:'',
      correo:'',
      fechaNacimiento: new Date(),
      direccion:'',
            usuarioSuperior: -1,
            usuarioRegistro: -1,
            usuarioActualiza: -1,
    } 

    formRegistrar = this.formBuilder.group({
      validaLogin: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{1,15}')], this.validaLogin.bind(this)],
      validaDni: ['', [Validators.required, Validators.pattern('[0-9]{8}')], this.validaDni.bind(this)],
      validaNombre: ['', [Validators.required,Validators.pattern('[a-zA-Z ]{1,100}')]],
      validaApellidos: ['', [Validators.required,Validators.pattern('[a-zA-Z ]{1,100}')]],
      validaCorreo: ['', [Validators.required,Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]],
      validaFechaNacimiento: ['', [Validators.pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/)]],
      validaDireccion: ['', [Validators.required,Validators.pattern('[a-zA-Z0-9.,# -]{3,100}')]],
    });

    //usuario en sesion
    objUsuario: Usuario = {};

    constructor(private prestatarioService: PrestatarioService,
                private tokenService: TokenService,
                private formBuilder: FormBuilder) {
      console.log(">>> constructor  >>> ");

    }

    ngOnInit(){
      console.log(">>> OnInit [inicio]");
      console.log(this.prestatario.usuarioActualiza);
      this.objUsuario.idUsuario = this.tokenService.getUserId();
      console.log(this.objUsuario.idUsuario);
      console.log(">>> objUsuario")
    }

    registra() {
      console.log(">>> registra [inicio]");
      this.prestatario.usuarioSuperior = this.objUsuario.idUsuario;
      this.prestatario.usuarioRegistro = this.objUsuario.idUsuario;
      this.prestatario.usuarioActualiza = this.objUsuario.idUsuario;
      console.log(">>> registra [inicio] " + this.prestatario);
      console.log(this.prestatario);

      this.prestatarioService.registrar(this.prestatario).subscribe(
        x=>{
              Swal.fire({ icon: 'info', title: 'Resultado del Registro', text: x.mensaje, });
          this.prestatario = {
            nombres: '',
            apellidos: '',
            dni: '',
            login: '',
            correo: '',
            fechaNacimiento: new Date(),
            direccion: '',
            usuarioSuperior: -1,
            usuarioRegistro: -1,
            usuarioActualiza: -1,
              }
          }
      );
    }


    validaLogin(control: FormControl) {
      console.log(">>> validaLogin [inicio] " + control.value);
      
       return this.prestatarioService.validaLoginRegistra(control.value).pipe(
         map((resp: any) => { 
              console.log(">>> validaLogin [resp] " + resp.valid);
              return (resp.valid) ? null : {existeLogin: true} ;    
            })
        );
    }

    validaDni(control: FormControl) {
      console.log(">>> validaDni [inicio] " + control.value);
      
       return this.prestatarioService.validaDniRegistra(control.value).pipe(
         map((resp: any) => { 
              console.log(">>> validaDni [resp] " + resp.valid);
              return (resp.valid) ? null : {existeDni: true} ;    
            })
        );
    }
}