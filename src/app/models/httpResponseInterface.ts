import { Product } from "./productInterface";

export interface ProductsResponse {
    limit: number;
    skip: number;
    total: number;
    products: Product[];
  }
  