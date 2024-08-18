import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Category } from 'src/app/models/categoryInterface';

@Component({
  selector: 'app-products-categories',
  templateUrl: './products-categories.component.html',
  styleUrls: ['./products-categories.component.scss'],
})
export class ProductsCategoriesComponent {
  @Input() categories: any;
  @Output() categorySelected = new EventEmitter<string>();

  selectedCategory: string = '';
  
  constructor(private cd: ChangeDetectorRef) {}
  
  onCategoryChange(category: any) {
    this.categorySelected.emit(category);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cd.detectChanges();
  }
}
