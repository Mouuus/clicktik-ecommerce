import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service/auth.service';
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
  authenticatedUser: boolean = false;
  constructor(
    private products: ProductsService,
    private router: Router,
    private authService: AuthService
  ) {
    this.authenticatedUser = this.authService.isAuthenticated();
    this.products.cartItemsSubject.subscribe((change) => {
      this.cartItems = change;
    });

    this.userQuestionUpdate
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.router.navigate(['/products'], {
          queryParams: { q: value },
        });
      });
  }
  ngOnInit(): void {
    this.authService.loggedIn$.subscribe((loggedIn) => {
      this.authenticatedUser = loggedIn;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['auth/login']);
  }
}
