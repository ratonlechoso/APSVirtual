//MODULOS
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome'
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
import { ProyectosService } from './components/proyectos/proyectos.service'
import { NgbDateCustomParserFormatter } from './components/tools/NgbDateCustomParserFormatter'

//RUTAS 
import {AppRoutingModule} from "./app.routes" 

//GUARDAS 
import { AuthGuard } from './components/tools/auth';

//CUSTOM PIPES
import { PairsPipe } from './components/tools/pairs-pipe';
import { OrderBy } from './components/tools/array-sort-pipe';
import { SearchPipe } from './components/tools/search-pipe';


//COMPONENTES
import { AppComponent } from './app.component';
import { NotFoundComponent } from './components/not-found.component';
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
import { UserUpdateComponent } from './components/user/user-update/user-update.component';
import { FieldErrorDisplayComponent } from './components/tools/field-error-display/field-error-display.component';
import { UserViewProfileComponent } from './components/user/user-view-profile/user-view-profile.component';
import { NavigationMenuExperienciasComponent } from './components/experiencias/navigation-menu-experiencias/navigation-menu-experiencias.component';
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
import { ExperienciasDetailComponent } from './components/experiencias/experiencias-detail/experiencias-detail.component';
import { UniversidadesComponent } from './components/universidades/universidades.component';
import { AmbitosComponent } from './components/ambitos/ambitos.component';
import { EspecialidadesComponent } from './components/especialidades/especialidades.component';
import { BiblioRecursosExternosComponent } from './components/biblio-recursos-externos/biblio-recursos-externos.component';
import { UniversidadesListComponent } from './components/universidades/universidades-list/universidades-list.component';
import { EspecialidadesListComponent } from './components/especialidades/especialidades-list/especialidades-list.component';
import { AmbitosListComponent } from './components/ambitos/ambitos-list/ambitos-list.component';
import { UniversidadesAddComponent } from './components/universidades/universidades-add/universidades-add.component';
import { EspecialidadesAddComponent } from './components/especialidades/especialidades-add/especialidades-add.component';
import { EspecialidadesEditComponent } from './components/especialidades/especialidades-edit/especialidades-edit.component';
import { UniversidadesEditComponent } from './components/universidades/universidades-edit/universidades-edit.component';
import { BiblioRecursosExternosListComponent } from './components/biblio-recursos-externos/biblio-recursos-externos-list/biblio-recursos-externos-list.component';
import { BiblioRecursosExternosEditComponent } from './components/biblio-recursos-externos/biblio-recursos-externos-edit/biblio-recursos-externos-edit.component';
import { BiblioRecursosExternosAddComponent } from './components/biblio-recursos-externos/biblio-recursos-externos-add/biblio-recursos-externos-add.component';
import { ProyectosListComponent } from './components/proyectos/proyectos-list/proyectos-list.component';
import { ProyectosCreateComponent } from './components/proyectos/proyectos-create/proyectos-create.component';
import { ProyectosSearchComponent } from './components/proyectos/proyectos-search/proyectos-search.component';
import { ProyectosUpdateComponent } from './components/proyectos/proyectos-update/proyectos-update.component';
import { NavigationMenuProyectosComponent } from './components/proyectos/navigation-menu-proyectos/navigation-menu-proyectos.component';
import { ProyectosComponent } from './components/proyectos/proyectos.component';
import { ProyectosDetailComponent } from './components/proyectos/proyectos-detail/proyectos-detail.component';
import { UsersManagerComponent } from './components/user/users-manager/users-manager.component';


//import { AngularFontAwesomeModule } from 'angular-font-awesome';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
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
    NavigationMenuExperienciasComponent,
    ExperienciasListComponent,
    ExperienciasComponent,
    ExperienciasSearchComponent,
    EnlacesExternosComponent,
    ContactoComponent,
    ExperienciasCreateComponent,
    TermsComponent,
    PoliticsComponent,
    ExperienciasUpdateComponent,
    ExperienciasDetailComponent,
    UniversidadesComponent,
    AmbitosComponent,
    EspecialidadesComponent,
    BiblioRecursosExternosComponent,
    UniversidadesListComponent,
    EspecialidadesListComponent,
    AmbitosListComponent,
    UniversidadesAddComponent,
    EspecialidadesAddComponent,
    EspecialidadesEditComponent,
    UniversidadesEditComponent,
    BiblioRecursosExternosListComponent,
    BiblioRecursosExternosEditComponent,
    BiblioRecursosExternosAddComponent,
    PairsPipe,
    OrderBy,
    SearchPipe,
    ProyectosListComponent,
    ProyectosCreateComponent,
    ProyectosSearchComponent,
    ProyectosUpdateComponent,
    NavigationMenuProyectosComponent,
    ProyectosComponent,
    ProyectosDetailComponent,
    UsersManagerComponent,
  ],
  imports: [
    Angular2FontawesomeModule,
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
    ProyectosService,
    CommonService,
    BsModalService, 
    AuthGuard,
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
  ],
  bootstrap: [AppComponent] 
})
export class AppModule { } 
 