import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AdministrationComponent } from './admin/administration/administration.component';
import { UserManagerComponent } from './admin/user-manager/user-manager.component';
import { CatalogManagerComponent } from './admin/catalog-manager/catalog-manager.component';
import { WebManagerComponent } from './admin/web-manager/web-manager.component';
import { CatalogsComponent } from './catalog/catalogs/catalogs.component';
import { CatalogComponent } from './catalog/catalog/catalog.component';
import { ScopeComponent } from './scope/scope/scope.component';
import { PropertyComponent } from './property/property/property.component';

import { SettingsManagerComponent } from './admin/settings-manager/settings-manager.component';
import { AuthentificationGuard } from './service/authentification.guard'
import { LoginComponent } from './login/login.component';
const routes: Routes = [
  { path: '', pathMatch: 'full', component: DashboardComponent, canActivate: [AuthentificationGuard], },
  { path: 'login', pathMatch: 'full', component: LoginComponent },
  {
    path: 'catalogs',
    canActivate: [AuthentificationGuard], component: CatalogsComponent
  },
  {
    path: "catalog/:catalogid", canActivate: [AuthentificationGuard], component: CatalogComponent
  },
  { path: "catalog/:catalogid/property/:propertyid", component: PropertyComponent },
  { path: "catalog/:catalogid/scope/:scopeid", component: ScopeComponent },
  {
    path: 'admin',
    canActivate: [AuthentificationGuard],
    children: [
      { path: '', pathMatch: 'full', component: AdministrationComponent },
      { path: "user", pathMatch: 'full', component: UserManagerComponent },
      { path: "catalog", pathMatch: 'full', component: CatalogManagerComponent },
      { path: "web", pathMatch: 'full', component: WebManagerComponent },
      { path: "settings", pathMatch: 'full', component: SettingsManagerComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
