import { Component } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { Catalogo } from '../../models/catalogo.model';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { DataCatalogoService } from '../../services/data-catalogo.service';
import Swal from 'sweetalert2';
import { map } from 'rxjs';

@Component({
  selector: 'app-crud-data-catalogo-agregar',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, MenuComponent, ReactiveFormsModule],
  templateUrl: './crud-data-catalogo-agregar.component.html',
  styleUrl: './crud-data-catalogo-agregar.component.css'
})
export class CrudDataCatalogoAgregarComponent {
  //formRegistrar: FormGroup;
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
  formRegistrar = this.formBuilder.group({
    validaDescripcion: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{3,30}')], this.validaDescripcion.bind(this)],
    idCatalogo: ['', Validators.required]
   // estado: [false, Validators.requiredTrue]
});
  constructor(
    private formBuilder: FormBuilder,
    private dataCatalogoService: DataCatalogoService,
    private utilService: UtilService,
            private tokenService: TokenService
  ) {
    console.log(">>> constructor  >>> ");

  }

  ngOnInit(): void {
    console.log(">>> OnInit [inicio]");

    this.loadDataCatalogos();
  }

  registrarDataCatalogo(): void {
    if (this.formRegistrar.valid) {
      const formValues = this.formRegistrar.value;
      const dataCatalogo = {
        descripcion: formValues.validaDescripcion,
        catalogo: { idCatalogo: formValues.idCatalogo },
        //estado: formValues.estado ? 1 : 0
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
  salir() {

  }
}
