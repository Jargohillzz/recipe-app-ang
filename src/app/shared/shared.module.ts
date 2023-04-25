import { NgModule } from '@angular/core';
import { DropdownDirective } from './dropdown.directive';
import { LoadingComponent } from './loading/loading.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [DropdownDirective, LoadingComponent],
  exports: [DropdownDirective, LoadingComponent, CommonModule, FormsModule],
  providers: [],
})
export class SharedModule {}
