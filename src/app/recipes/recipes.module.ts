import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipesComponent } from './recipes.component';
import { AuthGuard } from '../auth/auth.guard';
import { RecipeResolver } from './recipes-resolver.service';
import { SharedModule } from '../shared/shared.module';

const RecipeRoutes: Routes = [
  {
    path: 'recipes',
    component: RecipesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: RecipeStartComponent },
      { path: 'new', component: RecipeEditComponent },
      {
        path: ':id',
        component: RecipeDetailComponent,
        resolve: { reload: RecipeResolver },
      },
      {
        path: ':id/edit',
        component: RecipeEditComponent,
        resolve: { reload: RecipeResolver },
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(RecipeRoutes),
    ReactiveFormsModule,
    SharedModule,
  ],
  exports: [RouterModule, ReactiveFormsModule],
  declarations: [
    RecipesComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    RecipeStartComponent,
    RecipeEditComponent,
  ],
  providers: [],
})
export class RecipeModule {}
