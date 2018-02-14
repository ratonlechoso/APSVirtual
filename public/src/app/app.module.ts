//MODULOS
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
// import { NgbModule } from '@ng- bootstrap/ng-bootstrap';

//SERVICIOS
import { AuthService } from './auth.service';
import { CommonService } from './common.service';
import { UserService } from './components/user/user.service'
import { ExpService } from './components/experiencias/exp.service'
import { NgbDateCustomParserFormatter } from './components/tools/NgbDateCustomParserFormatter'

//RUTAS 
import {AppRoutingModule} from "./app.routes" 

//COMPONENTES
import { AppComponent } from './app.component';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserEditComponent } from './components/user/user-edit/user-edit.component';
import { UserDetailsComponent } from './components/user/user-details/user-details.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { UserLoginComponent } from './components/user/user-login/user-login.component';
import { UserRegisterComponent } from './components/user/user-register/user-register.component';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { GlobalEventsManager } from './GlobalEventsManager';
import { UserComponent } from './components/user/user.component';
import { ResetPassComponent } from './components/user/reset-pass/reset-pass.component';
import { AuthGuard } from './components/tools/auth';
import { UserUpdateComponent } from './components/user/user-update/user-update.component';
import { FieldErrorDisplayComponent } from './components/tools/field-error-display/field-error-display.component';
import { UserViewProfileComponent } from './components/user/user-view-profile/user-view-profile.component';
import { NavigationMenuComponent } from './components/experiencias/navigation-menu/navigation-menu.component';
import { BsModalModule, BsModalService } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ExperienciasListComponent } from './components/experiencias/experiencias-list/experiencias-list.component';
import { ExperienciasComponent } from './components/experiencias/experiencias.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ExperienciasSearchComponent } from './components/experiencias/experiencias-search/experiencias-search.component';
import { EnlacesExternosComponent } from './components/enlaces-externos/enlaces-externos.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { ExperienciasCreateComponent } from './components/experiencias/experiencias-create/experiencias-create.component';
import { TermsComponent } from './components/terms/terms.component';
import { PoliticsComponent } from './components/politics/politics.component';
import { ExperienciasUpdateComponent } from './components/experiencias/experiencias-update/experiencias-update.component';


//import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserEditComponent,
    UserDetailsComponent,
    HomeComponent,
    AboutComponent,
    UserLoginComponent,
    UserRegisterComponent,
    MenuBarComponent,
    UserComponent,
    ResetPassComponent,
    FooterComponent,
    UserUpdateComponent,
    FieldErrorDisplayComponent,
    UserViewProfileComponent,
    NavigationMenuComponent,
    ExperienciasListComponent,
    ExperienciasComponent,
    ExperienciasSearchComponent,
    EnlacesExternosComponent,
    ContactoComponent,
    ExperienciasCreateComponent,
    TermsComponent,
    PoliticsComponent,
    ExperienciasUpdateComponent
  ],
  imports: [
    BrowserModule, 
    HttpModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BsModalModule,
    NgxPaginationModule,
    FileUploadModule,
  //  AngularFontAwesomeModule
     NgbModule.forRoot()
  ],
  providers: [
    AuthService,
    GlobalEventsManager,
    UserService,
    ExpService,
    CommonService,
    BsModalService, 
    AuthGuard,
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
  ],
  bootstrap: [AppComponent] 
})
export class AppModule { } 
 