import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductsResponse } from 'src/app/models/httpResponseInterface';
import { Category } from 'src/app/models/categoryInterface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private baseUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {}
  public cartItemsSubject = new BehaviorSubject<number>(0);

  getProducts(
    skip: number,
    limit: number,
    order: string
  ): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(
      `${this.baseUrl}/products?limit=${limit}&skip=${skip}&order=${order}`
    );
  }

  getProductsByCategory(
    category: string,
    order: string
  ): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(
      `${this.baseUrl}/products/category/${category}?order=${order}`
    );
  }

  getProductsBySearchQuery(
    input: string,
    skip: number,
    limit: number,
    order: string
  ): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(
      `${this.baseUrl}/products/search?q=${input}&limit=${limit}&skip=${skip}&order=${order}`
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/products/categories`);
  }
}
