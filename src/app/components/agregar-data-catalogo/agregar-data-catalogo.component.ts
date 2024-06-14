import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { DataCatalogoService } from '../../services/data-catalogo.service';
import { Catalogo } from '../../models/catalogo.model';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../../app.material.module';
import { MenuComponent } from '../../menu/menu.component';

@Component({
  selector: 'app-data-catalogo',
  templateUrl: './agregar-data-catalogo.component.html',
  styleUrls: ['./agregar-data-catalogo.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AppMaterialModule, MenuComponent]
})
export class AgregarDataCatalogoComponent implements OnInit {
  formRegistrar: FormGroup;
  catalogoList: Catalogo[] = [];

  data: DataCatalogo = {
    descripcion: "",
    estado: -1,
    catalogo: {
      idCatalogo: -1
    },
    usuarioPrestatario: {
      idUsuario: -1
    },
    usuarioRegistro: {
      idUsuario: -1
    }
  };

  constructor(
    private formBuilder: FormBuilder,
    private dataCatalogoService: DataCatalogoService
  ) {
    this.formRegistrar = this.formBuilder.group({
      validaDescripcion: ['',
        [Validators.required, Validators.pattern('^[a-zA-Z ]{3,30}$')],
        this.validaDescripcion.bind(this)
      ],
      idCatalogo: ['', Validators.required],
      estado: [false, Validators.requiredTrue]
    });
    this.formRegistrar.statusChanges.subscribe(status => {
      console.log('Estado del formulario: ', status);
    });

    this.formRegistrar.valueChanges.subscribe(value => {
      console.log('Valores del formulario: ', value);
    });
  }

  ngOnInit(): void {
    this.loadDataCatalogos();
  }

  registrarDataCatalogo(): void {
    if (this.formRegistrar.valid) {
      const formValues = this.formRegistrar.value;
      const dataCatalogo = {
        descripcion: formValues.validaDescripcion,
        catalogo: { idCatalogo: formValues.idCatalogo },
        estado: formValues.estado ? 1 : 0
      };
      this.dataCatalogoService.registrarDataCatalogo(dataCatalogo).subscribe({
        next: (x) => {
          Swal.fire({ icon: 'info', title: 'Resultado del Registro', text: x.mensaje, });
          this.formRegistrar.reset();
        },

        error: () => Swal.fire('Error', 'No se pudo registrar el catálogo', 'error'),


      });

      console.log('Data Catalogo', dataCatalogo);
    } else {
      console.log('Formulario inválido:', this.formRegistrar);
    }
  }

  loadDataCatalogos(): void {
    this.dataCatalogoService.listaCatalogo().subscribe({
      next: (data) => {
        this.catalogoList = data;
      },
      error: (error) => console.error('Error al cargar los datos del catálogo', error)
    });
  }

  validaDescripcion(control: FormControl) {
    return this.dataCatalogoService.validaDescripcionRegistra(control.value).pipe(
      map((resp: any) => {
        return resp.valid ? null : { existeDescripcion: true };
      })
    );
  }
}
