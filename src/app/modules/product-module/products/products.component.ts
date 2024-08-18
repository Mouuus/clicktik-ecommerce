import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/models/categoryInterface';
import { ProductsResponse } from 'src/app/models/httpResponseInterface';
import { Product } from 'src/app/models/productInterface';
import { ProductsService } from 'src/app/services/products-service/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute
  ) {}
  categories: Category[] = [];
  products: Product[] = [];
  categoryCounts: Record<string, number> = {};
  categoryNames: Record<string, string> = {};
  totalItems: number = 10;
  page: number = 1;
  pageSize: number = 10;
  selectedCategory: string = '';
  searchQuery: string = '';
  lastMethod: string = '';
  ngOnInit(): void {
    this.getCategories();
    this.handleSearchQuery();
  }

  // separated function to get categories list
  getCategories() {
    this.productService.getCategories().subscribe(
      (response: Category[]) => {
        this.categories = response;
      },
      (error: any) => {}
    );
  }

  //getting products
  getProducts(skip: number, limit: number,order:string) {
    this.productService
      .getProducts(skip ? skip : 0, limit ? limit : 10,order)
      .subscribe(
        (response: ProductsResponse) => {
          this.successHandler(response, 'fetchAllProducts');
          setTimeout(() => {
            this.getCategoryProductCounts();
          }, 100);
        },
        (error: any) => {}
      );
  }

  //getting products by categories filtering
  getProductsByCategory(category: string,order:string) {
    this.productService.getProductsByCategory(category,order).subscribe(
      (response: ProductsResponse) => {
        this.successHandler(response, 'fetchProductsByCategory');
        this.getCategoryProductCounts();
      },
      (error: any) => {}
    );
  }

  //getting products by search query
  getProductsBySearchQuery(searcyQuery: string, skip: number, limit: number,order:string) {
    this.productService
      .getProductsBySearchQuery(searcyQuery, skip, limit,order)
      .subscribe(
        (response: ProductsResponse) => {
          this.successHandler(response, 'fetchProductsBySearchQuery');
          this.getCategoryProductCounts();
        },
        (error: any) => {}
      );
  }

  //this handles if the user used the search feature or just navigated to the products component without search query
  handleSearchQuery(skip?: number, limit?: number) {
    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['q'] || null;
      if (this.searchQuery !== null || this.searchQuery == '') {
        this.getProductsBySearchQuery(
          this.searchQuery,
          skip ? skip : 0,
          limit ? limit : 10,'popularity'
        );
      } else {
        this.getProducts(skip ? skip : 0, limit ? limit : 10,'popularity');
      }
    });
  }

  //reuse the same handling to success products assigning
  successHandler(response: ProductsResponse, lastMethod: string) {
    this.lastMethod = lastMethod;
    this.products = response.products;
    this.totalItems = response.total;
  }

  //to handle the pagination change
  onPageChange(event: any) {
    const skip = (this.page - 1) * this.pageSize;
    const limit = this.pageSize;
    this.handleSearchQuery(skip, limit);
  }

  //handle when category changes
  onCategorySelected(category: string) {
    this.selectedCategory = category;
    this.getProductsByCategory(this.selectedCategory,'popularity');
  }

  getCategoryProductCounts() {
    // Initialize counts and map slugs to names
    this.categories.forEach((category) => {
      this.categoryCounts[category.slug] = 0;
      this.categoryNames[category.slug] = category.name;
    });

    // Count products for each category
    this.products.forEach((product) => {
      if (this.categoryCounts.hasOwnProperty(product.category)) {
        this.categoryCounts[product.category]++;
      }
    });

    // Map slug counts to names
    const result: Record<string, number> = {};
    for (const slug in this.categoryCounts) {
      if (this.categoryCounts.hasOwnProperty(slug)) {
        result[this.categoryNames[slug]] = this.categoryCounts[slug];
      }
    }
    this.categoryCounts = result;
  }

  onSortChange(event: any): void {
    const order=event.target.value;
    switch (this.lastMethod) {
      case 'fetchAllProducts':
        this.getProducts(0, 10,order);
        break;
      case 'fetchProductsByCategory':
        this.getProductsByCategory(this.selectedCategory,order);
        break;
      case 'fetchProductsBySearchQuery':
        this.getProductsBySearchQuery(this.searchQuery, 0, 10,order);

        break;
    }
  }
}
