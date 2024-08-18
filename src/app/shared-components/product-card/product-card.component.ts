import { Component, Input } from '@angular/core';
import { Product } from 'src/app/models/productInterface';
import { ProductsService } from 'src/app/services/products-service/products.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() product: Product = {};
  constructor(private productService: ProductsService) {}

  addToCart() {
    this.productService.cartItemsSubject.next(
      this.productService.cartItemsSubject.value + 1
    );
  }
}
