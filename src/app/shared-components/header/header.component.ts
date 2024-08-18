import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ProductsService } from 'src/app/services/products-service/products.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public cartItems: number = 0;
  searchControl = '';
  userQuestionUpdate = new Subject<string>();

  constructor(private products: ProductsService, private router: Router) {

    this.products.cartItemsSubject.subscribe((change) => {
      this.cartItems = change;
    });

    this.userQuestionUpdate.pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.router.navigate(['/products'], {
          queryParams: { q: value },
        });
      });

  }


}
