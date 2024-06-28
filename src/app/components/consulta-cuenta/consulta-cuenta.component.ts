import { Component, ViewChild } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataCatalogo } from '../../models/dataCatalogo.model';
import { EntidadFinanciera } from '../../models/entidad-financiera.model';
import { MatPaginator } from '@angular/material/paginator';
import { CuentaService } from '../../services/cuenta.service';
import { UtilService } from '../../services/util.service';
import { TokenService } from '../../security/token.service';
import { MenuComponent } from '../../menu/menu.component';

@Component({
  selector: 'app-consulta-cuenta',
  standalone: true,
  imports: [AppMaterialModule, FormsModule, CommonModule, ReactiveFormsModule, MenuComponent],
  templateUrl: './consulta-cuenta.component.html',
  styleUrl: './consulta-cuenta.component.css'
})
export class ConsultaCuentaComponent {
  constructor(private _cuentaService: CuentaService,
              private _utilService: UtilService,
              private _tokenService: TokenService) {

  }

  ngOnInit() {
    this._utilService.listaTipoMoneda().subscribe(
      x =>
        this.tipoMoneda = x
    );

    this._utilService.listaTipoEntidadBancaria().subscribe(
      x =>
        this.tipoEntidadBancaria = x
    );

  }

  // Lista de Entidad Financiera
  tipoEntidad: EntidadFinanciera[] = [];

  // Lista de Entidad bancaria
  tipoEntidadBancaria: DataCatalogo[] = [];

  // Lista de Tipo de moneda
  tipoMoneda: DataCatalogo[] = [];

  // idTipoEntidad
  idTipoEntidad?: number = -1;

  // Consulta
  numero: string = "";
  entidad: number = -1;
  moneda: number = -1;
  estado: boolean = true;


  // Data
  data: any;

  // Paginator
  @ViewChild (MatPaginator, {static: true}) paginator!: MatPaginator;

  // Header
  columns = ["idCuenta", "numero", "entidad", "moneda", "estado"]


  listarEntidadFinanciera(){
    this._cuentaService.listar(this.idTipoEntidad).subscribe(
      x => {
        this.tipoEntidad = x;
      }
    )
  }

  // method
  consultar() {
    this._cuentaService.consultaCompleja(
      this.numero,
      this.entidad,
      this.moneda,
      this.idTipoEntidad!,
      this.estado ? 1 : 0).subscribe(
      x => {
        this.data = x;
        this.data.paginator = this.paginator
       }
    );
  }

}
