import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { UserLoginComponent } from './components/user/user-login/user-login.component';
import { UserRegisterComponent } from './components/user/user-register/user-register.component';
import { UserUpdateComponent } from './components/user/user-update/user-update.component';
import { UserViewProfileComponent } from './components/user/user-view-profile/user-view-profile.component';
import { UsersManagerComponent } from './components/user/users-manager/users-manager.component';
import { ResetPassComponent } from './components/user/reset-pass/reset-pass.component';

import { ExperienciasComponent } from './components/experiencias/experiencias.component';
import { ExperienciasListComponent } from './components/experiencias/experiencias-list/experiencias-list.component';
import { ExperienciasSearchComponent } from './components/experiencias/experiencias-search/experiencias-search.component';
import { ExperienciasCreateComponent } from './components/experiencias/experiencias-create/experiencias-create.component';
import { ExperienciasUpdateComponent } from './components/experiencias/experiencias-update/experiencias-update.component';
import { ExperienciasDetailComponent } from './components/experiencias/experiencias-detail/experiencias-detail.component';

import { ProyectosComponent } from './components/proyectos/proyectos.component';
import { ProyectosListComponent } from './components/proyectos/proyectos-list/proyectos-list.component';
import { ProyectosSearchComponent } from './components/proyectos/proyectos-search/proyectos-search.component';
import { ProyectosCreateComponent } from './components/proyectos/proyectos-create/proyectos-create.component';
import { ProyectosUpdateComponent } from './components/proyectos/proyectos-update/proyectos-update.component';
import { ProyectosDetailComponent } from './components/proyectos/proyectos-detail/proyectos-detail.component';

import { UniversidadesComponent } from './components/universidades/universidades.component';
import { AmbitosComponent } from './components/ambitos/ambitos.component';
import { EspecialidadesComponent } from './components/especialidades/especialidades.component';
import { EnlacesExternosComponent } from './components/enlaces-externos/enlaces-externos.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { TermsComponent } from './components/terms/terms.component';
import { PoliticsComponent } from './components/politics/politics.component';
import { AuthGuard } from './components/tools/auth';
import { BiblioRecursosExternosComponent } from './components/biblio-recursos-externos/biblio-recursos-externos.component';

//import { NoContentComponent } from './no-content';

const appRoutes: Routes = [
  { 
    path: 'home', 
    component: HomeComponent
  },
  { 
    path: 'private', 
    component: AboutComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'about', 
    component: AboutComponent
  },
  { 
    path: 'login', 
    component: UserLoginComponent,
  },
  { 
    path: 'register', 
    component: UserRegisterComponent
  },
  { 
    path: 'userViewProfile', 
    component: UserViewProfileComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'userUpdate', 
    component: UserUpdateComponent,
    canActivate: [AuthGuard],
    data: {roles: [1,2,3,4,5]}
  },
  { 
    path: 'usersManager', 
    component: UsersManagerComponent,
    canActivate: [AuthGuard],
    data: {roles: [5]}
  },
  { 
    path: 'reset-pass', 
    component: ResetPassComponent
  },
  { 
    path: 'experiencias', 
    component: ExperienciasComponent
  },
  // {
  //   path: 'experiencias-list', 
  //   component: ExperienciasListComponent,
  //   outlet: 'sidebar'
  // },
  { 
    path: 'experiencias-list', 
    component: ExperienciasListComponent
  },
  { 
    path: 'experiencias-add', 
    component: ExperienciasCreateComponent,
    canActivate: [AuthGuard],
    data: {roles: [4,5]}
  },
  { 
    path: 'experiencias-update', 
    component: ExperienciasUpdateComponent,
    canActivate: [AuthGuard],
    data: {roles: [4,5]}
  },
  { 
    path: 'experiencias-detail', 
    component: ExperienciasDetailComponent
  },
  { 
    path: 'experiencias-search', 
    component: ExperienciasSearchComponent
  },
  { 
    path: 'proyectos', 
    component: ProyectosComponent
  },
  // {
  //   path: 'experiencias-list', 
  //   component: ExperienciasListComponent,
  //   outlet: 'sidebar'
  // },
  { 
    path: 'proyectos-list', 
    component: ProyectosListComponent
  },
  { 
    path: 'proyectos-add', 
    component: ProyectosCreateComponent,
    canActivate: [AuthGuard],
    data: {roles: [4,5]}
  },
  { 
    path: 'proyectos-update', 
    component: ProyectosUpdateComponent,
    canActivate: [AuthGuard],
    data: {roles: [4,5]}
  },
  { 
    path: 'proyectos-detail', 
    component: ProyectosDetailComponent
  },
  { 
    path: 'proyectos-search', 
    component: ProyectosSearchComponent
  },
  { 
    path: 'enlaces-externos', 
    component: EnlacesExternosComponent
  },
  { 
    path: 'universidades', 
    component: UniversidadesComponent,
    canActivate: [AuthGuard],
    data: {roles: [4,5]}
  },
  { 
    path: 'ambitos', 
    component: AmbitosComponent,
    canActivate: [AuthGuard],
    data: {roles: [4,5]}
  },
  { 
    path: 'especialidades', 
    component: EspecialidadesComponent,
    canActivate: [AuthGuard],
    data: {roles: [4,5]}
  },
  { 
    path: 'biblio-recursos-externos', 
    component: BiblioRecursosExternosComponent
  },
  { 
    path: 'contacto', 
    component: ContactoComponent
  },
  { 
    path: 'politica', 
    component: PoliticsComponent
  },
  { 
    path: 'terminos', 
    component: TermsComponent
  },
  { 
    path: '**',    
    pathMatch: 'full', 
    redirectTo: 'home' 
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}


// const app_routes: Routes = [
//   { path: 'home',  component: HomeComponent },
//   { path: 'about', component: AboutComponent },
//   { path: 'login', component: UserLoginComponent }, 
//   { path: 'register', component: UserRegisterComponent },
//   { path: '**',    pathMatch: 'full', redirectTo: 'home' },
// ];

// export const app_routing = RouterModule.forRoot(app_routes);

//si queremos que en la ruta urlaparezca el # se debe poner asi ...
//export const app_routing = RouterModule.forRoot(app_routes, {useHash: true});