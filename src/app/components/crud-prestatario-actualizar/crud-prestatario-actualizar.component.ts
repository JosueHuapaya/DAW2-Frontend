import { Component, Inject, OnInit } from '@angular/core';
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
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-crud-prestatario-actualizar',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-prestatario-actualizar.component.html',
  styleUrl: './crud-prestatario-actualizar.component.css'
})
export class CrudPrestatarioActualizarComponent {

  prestatario: Prestatario = {
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

  formRegistrar = this.formBuilder.group({
    validaLogin: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{1,15}')], this.validaElLogin.bind(this)],
    validaDni: ['', [Validators.required, Validators.pattern('[0-9]{8}')], this.validaElDni.bind(this)],
    validaNombre: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{1,100}')]],
    validaApellidos: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{1,100}')]],
    validaCorreo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)]],
    validaFechaNacimiento: ['', [Validators.required, Validators.pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/)]],
    validaDireccion: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9.,# -]{3,100}')]],
  });

  objUsuario: Usuario = {};

  constructor(private prestatarioService: PrestatarioService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Prestatario) {

    this.prestatario = data;
    console.log(">>> constructor  >>> ");

  }

  ngOnInit() {
    console.log(">>> OnInit [inicio]");
    console.log(this.prestatario.usuarioActualiza);
    this.objUsuario.idUsuario = this.tokenService.getUserId();
    console.log(this.objUsuario.idUsuario);
    console.log(">>> objUsuario")
  }

  actualizar() {
    console.log(">>> registra [inicio]");
    this.prestatario.usuarioSuperior = this.objUsuario.idUsuario;
    this.prestatario.usuarioRegistro = this.objUsuario.idUsuario;
    this.prestatario.usuarioActualiza = this.objUsuario.idUsuario;
    console.log(">>> registra [inicio] " + this.prestatario);
    console.log(this.prestatario);

    this.prestatarioService.actualizaPrestatarioCrud(this.prestatario).subscribe(
      x => {
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

  validaElLogin(control: FormControl) {
    console.log(">>> validaLogin [inicio] " + control.value);
    return this.prestatarioService.validaElLoginActualiza(control.value, this.prestatario.idUsuario || 0).pipe(
      map((resp: any) => {
        console.log(">>> validaLogin [resp] " + resp.valid);
        return (resp.valid) ? null : { existeLogin: true };
      })
    );
  }

  validaElDni(control: FormControl) {
    console.log(">>> validaDni [inicio] " + control.value);

    return this.prestatarioService.validaElDniActualiza(control.value, this.prestatario.idUsuario || 0).pipe(
      map((resp: any) => {
        console.log(">>> validaDni [resp] " + resp.valid);
        return (resp.valid) ? null : { existeDni: true };
      })
    );
  }

  salir() {

  }
}