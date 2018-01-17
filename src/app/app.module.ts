import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HashLocationStrategy, Location, LocationStrategy } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http'
import { FormsModule } from '@angular/forms';
/**Translator */
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
/*Editor*/ 
import { QuillModule } from 'ngx-quill';


/*MATERIAL*/
import { MatSidenavModule } from '@angular/material';
import { MatListModule } from '@angular/material';
import {MatIconModule} from '@angular/material';
import {MatButtonModule} from '@angular/material';
import {MatSelectModule} from '@angular/material';
import {MatInputModule} from '@angular/material';
import {MatSnackBarModule} from '@angular/material';
import {MatDialogModule} from '@angular/material';
import {MatCheckboxModule} from '@angular/material';
import {MatMenuModule} from '@angular/material';
import {MatTabsModule} from '@angular/material';
import {MatExpansionModule} from '@angular/material';
import {MatPaginatorModule} from '@angular/material';
import {MatRadioModule} from '@angular/material/radio';
import {MatToolbarModule} from '@angular/material/toolbar';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { DataConnectorService } from './service/data-connector.service';
import { DynamicMenuService } from './service/dynamic-menu.service';
import { LogService } from './service/log.service';
import {AuthentificationService} from './service/authentification.service'
import {AuthentificationGuard} from './service/authentification.guard'
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdministrationComponent } from './admin/administration/administration.component';
import { UserManagerComponent } from './admin/user-manager/user-manager.component';
import { CatalogManagerComponent } from './admin/catalog-manager/catalog-manager.component';
import { WebManagerComponent } from './admin/web-manager/web-manager.component';
import { HtmlEditorComponent } from './controls/html-editor/html-editor.component';
import { DialogListSelectComponent } from './controls/dialog-list-select/dialog-list-select.component';
import { CatalogsComponent } from './catalog/catalogs/catalogs.component';
import { CatalogComponent } from './catalog/catalog/catalog.component';

import { MetadataComponent } from './controls/metadata/metadata.component';
import { ScopeGroupsComponent } from './controls/scope-groups/scope-groups.component';

import { ScopesComponent } from './scope/scopes/scopes.component';
import { ScopeComponent } from './scope/scope/scope.component';

import { PropertiesComponent } from './property/properties/properties.component';
import { PropertyComponent } from './property/property/property.component';

import { ValuesComponent } from './controls/values/values.component';
import { SettingsManagerComponent} from './admin/settings-manager/settings-manager.component';
import { MetadataLabelByLanguageDirective } from './directives/metadata-label-by-language.directive';
import { LoginComponent } from './login/login.component';

import { FlexLayoutModule } from "@angular/flex-layout";

import { ActionListComponent } from './controls/action-list/action-list.component';
import { DynPropertiesListComponent } from './controls/dyn-properties-list/dyn-properties-list.component';
import { ChangelogComponent } from './controls/changelog/changelog.component';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http,'./assets/i18n/');
}

@NgModule({
  declarations: [
    AppComponent,
    AdministrationComponent,
    DashboardComponent,
    UserManagerComponent,
    CatalogManagerComponent,
    WebManagerComponent,
    HtmlEditorComponent,
    DialogListSelectComponent,
    CatalogsComponent,
    CatalogComponent,
    MetadataComponent,
    ScopeGroupsComponent,
    ScopesComponent,
    PropertiesComponent,
    ValuesComponent,
    SettingsManagerComponent,
    MetadataLabelByLanguageDirective,
    LoginComponent,
    PropertyComponent,
    ActionListComponent,
    DynPropertiesListComponent,
    ScopeComponent,
    ChangelogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FlexLayoutModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    AppRoutingModule,
    QuillModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCheckboxModule,
    MatMenuModule,
    MatTabsModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatRadioModule,
    MatToolbarModule

  ],
  entryComponents: [
    DialogListSelectComponent
  ],
  providers: [
    AuthentificationService,
    AuthentificationGuard,
    DataConnectorService,
    DynamicMenuService,
    LogService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
