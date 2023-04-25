import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  // @ViewChild('nameInput', { static: false }) nameInputRef: ElementRef;
  // @ViewChild('amountInput', { static: false }) amountInputRef: ElementRef;
  @ViewChild('f', { static: false }) ingForm: NgForm;
  editMode: boolean = false;
  editIngredient: Ingredient;
  subscription: Subscription;
  editIndex: number;

  constructor(private slService: ShoppingListService) {}

  ngOnInit() {
    this.subscription = this.slService.inEditMode.subscribe((index: number) => {
      this.editIndex = index;
      this.editMode = true;
      this.editIngredient = this.slService.getSingleIngredient(index);
      this.ingForm.setValue({
        name: this.editIngredient.name,
        amount: this.editIngredient.amount,
      });
    });
  }

  onAddItem(form: NgForm) {
    const ingName = form.value.name;
    const ingAmount = form.value.amount;
    const newIngredient = new Ingredient(ingName, ingAmount);
    this.editMode
      ? this.slService.addEditedIngredient(this.editIndex, newIngredient)
      : this.slService.addIngredient(newIngredient);
    this.onClear();
  }

  onClear() {
    this.ingForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.slService.deleteIngredient(this.editIndex);
    this.onClear();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
