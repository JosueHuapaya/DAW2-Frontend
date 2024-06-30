import { Component } from '@angular/core';

import Swal from 'sweetalert2'

import { MontoPrestamo } from '../../models/monto-prestamo.model';
import { AppMaterialModule } from '../../app.material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, Validators, ReactiveFormsModule, Form, FormControl } from '@angular/forms';

import { MenuComponent } from '../../menu/menu.component';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { MontoPrestamoService } from '../../services/monto-prestamo.service';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { Usuario } from '../../models/usuario.model';
import { map } from 'rxjs';


@Component({
  selector: 'app-crud-monto-prestamo-actualizar',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-monto-prestamo-actualizar.component.html',
  styleUrl: './crud-monto-prestamo-actualizar.component.css'
})
export class CrudMontoPrestamoActualizarComponent {
  montoPrestamo: MontoPrestamo ={
    capital: 0,

    dias: {
      idDataCatalogo: -1,
    },
    monto: 0,
    
    usuarioRegistro: {
        idUsuario: -1
    },
    usuarioActualiza: {
        idUsuario: -1
    },  
 }
   
    formRegistrarmonto = this.formBuilder.group({
      validaCapital: ['', [Validators.required, Validators.pattern(/^\d{2,4}$/)]],
      validaMonto: ['', [Validators.required, Validators.pattern(/^\d{4}(\.\d+)?$/)]],
      validaDias: ['', [Validators.min(1)]],
    });
   
      //lista de días
      lstDias : DataCatalogo[] = [];
      
      //usuario en sesion
       objUsuario: Usuario = {};


    constructor(private montoPrestamoService: MontoPrestamoService,
                private utilService: UtilService,
                private tokenService: TokenService,
                private formBuilder: FormBuilder) {
                console.log(">>> constructor  >>> ");
          }


          ngOnInit() {
                 console.log(">>> OnInit [inicio]");
              
                  this.utilService.listaDiasPrestamo().subscribe(
                            x => this.lstDias = x
                  );
                  
                  
                  this.objUsuario.idUsuario = this.tokenService.getUserId();
                  console.log(">>> OnInit >>> " + this.lstDias);
                  console.log(">>> OnInit [fin]");      
              }

              actualiza() {
        console.log(">>> actualiza [inicio]");
        if(this.formRegistrarmonto.valid){
          
        this.montoPrestamo.usuarioActualiza = this.objUsuario;
        this.montoPrestamo.usuarioRegistro = this.objUsuario;
        console.log(">>> actualiza [inicio] " + this.montoPrestamo);
        console.log(this.montoPrestamo);

        }
        this.montoPrestamoService.actualizarMonto(this.montoPrestamo).subscribe(
          x=>{
                Swal.fire({ icon: 'info', title: 'Resultado de Actualiizacions', text: x.mensaje, });
                this.montoPrestamo ={
                        capital: 0,
                
                        dias: {
                            idDataCatalogo: -1,
                        },
                        monto: 0,
                        
                        usuarioRegistro: {
                            idUsuario: -1
                        },
                        usuarioActualiza: {
                            idUsuario: -1
                        },  
                    }
            }
        );
    }

    validaCapital(control: FormControl) {
      console.log(">>> validaCapital [inicio] " + control.value);
      
       return this.montoPrestamoService.validaactualizamontoprestamo(control.value, this.montoPrestamo.idMontoPrestamo || 0).pipe(
         map((resp: any) => { 
              console.log(">>> validaCapital [resp] " + resp.valid);
              return (resp.valid) ? null : {existeCapital: true} ;    
            })
        );
     }

  }

