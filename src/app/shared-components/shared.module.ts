import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductsCategoriesComponent } from './products-categories/products-categories.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ProductCardComponent, ProductsCategoriesComponent],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports:[ProductCardComponent,ProductsCategoriesComponent]
})
export class SharedModule { }
