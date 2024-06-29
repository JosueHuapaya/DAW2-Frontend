import { Component } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { SolicitudPrestamo } from '../../models/solicitud-prestamo.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { Usuario } from '../../models/usuario.model';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { SolicitudPrestamoService } from '../../services/solicitud-prestamo.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-agregar-solicitud-prestamo',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './agregar-solicitud-prestamo.component.html',
  styleUrl: './agregar-solicitud-prestamo.component.css'
})

export class AgregarSolicitudPrestamoComponent {

  solicitudPrestamo: SolicitudPrestamo ={
    capital: 0,
    dias:{
      idDataCatalogo:-1
    },
    montoPagar :0,
    fechaInicioPrestamo:null,
    fechaFinPrestamo:null,
    usuarioPrestatario: {
        idUsuario: -1
    },
    usuarioRegistro: {
        idUsuario: -1
    },
    usuarioActualiza: {
        idUsuario: -1
    }
  }

  //Formulario
  formRegistrarSolicitudPrestamo = this.formBuilder.group({
    validaCapital: ['', [Validators.required, Validators.pattern(/^\d{2,6}(\.\d{1,2})?$/)]],
    validaDias: ['', [Validators.required, Validators.min(1)]],
    validaMontoPagar: ['', [Validators.required, Validators.pattern(/^\d{2,6}(\.\d{1,2})?$/)]],
    validaFechaInicioPrestamo: ['', [Validators.required]],
    validaFechaFinPrestamo: ['', [Validators.required]],
    validaPrestatario: ['', [Validators.required, Validators.min(1)]]
  });

  //Lista de días
  lstDias : DataCatalogo[] = [];

  //Lista de prestatarios
  lstPrestatarios : Usuario[] = [];

  //Usuario en sesión
  objUsuario: Usuario = {};

  constructor(private formBuilder: FormBuilder,
              private solicitudPrestamoService: SolicitudPrestamoService,
              private tokenService: TokenService,
              private utilService: UtilService) {
    console.log(">>> constructor  >>> ");
  }

  //Comprobar que fecha fin sea mayor a fecha inicio
  fechaFinMayorQueFechaInicio(): boolean {
    const fechaInicio = this.formRegistrarSolicitudPrestamo.get('validaFechaInicioPrestamo')?.value;
    const fechaFin = this.formRegistrarSolicitudPrestamo.get('validaFechaFinPrestamo')?.value;
    return (fechaInicio && fechaFin && new Date(fechaFin) <= new Date(fechaInicio)) ? false : true;
  }

  ngOnInit() {
    console.log(">>> OnInit [inicio]");

    //Obtener lista de dias de la BD
    this.utilService.listaDiasPrestamo().subscribe(
      x => this.lstDias = x
    );

    //Obtener lista de Prestatarios de la BD
    this.solicitudPrestamoService.listaPrestatariosTotales().subscribe(
      x => this.lstPrestatarios = x
    );

    //Obtener idUsuario del usuario logeado
    this.objUsuario.idUsuario = parseInt(this.tokenService.getUserId());

    console.log(">>> OnInit [fin]");
  }

  registra() {
    console.log(">>> registra [inicio]");
    
    this.solicitudPrestamo.usuarioActualiza= this.objUsuario;
    this.solicitudPrestamo.usuarioRegistro = this.objUsuario;
    this.solicitudPrestamoService.registrar(this.solicitudPrestamo).subscribe(
      x=>{
            
            Swal.fire({ icon: 'info', title: 'Resultado del Registro', text: x.mensaje, });

            // Reinicio del formulario
            this.formRegistrarSolicitudPrestamo.reset();

            this.solicitudPrestamo ={
              capital: 0,
              dias:{
                idDataCatalogo:-1
              },
              montoPagar :0,
              fechaInicioPrestamo:null,
              fechaFinPrestamo:null,
              usuarioPrestatario: {
                  idUsuario: -1
              },
              usuarioRegistro: {
                  idUsuario: -1
              },
              usuarioActualiza: {
                  idUsuario: -1
              }
            }
        }
    );
  }
}
