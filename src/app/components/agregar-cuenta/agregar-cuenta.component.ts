import { Component } from '@angular/core';
import { AppMaterialModule } from '../../app.material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';


@Component({
  selector: 'app-agregar-cuenta',
  standalone: true,
  imports: [
    AppMaterialModule,
    FormsModule,
    CommonModule,
    MenuComponent,
    ReactiveFormsModule
  ],
  templateUrl: './agregar-cuenta.component.html',
  styleUrl: './agregar-cuenta.component.css'
})
export class AgregarCuentaComponent {

}
