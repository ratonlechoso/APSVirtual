import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { UserLoginComponent } from './components/user/user-login/user-login.component';
import { UserRegisterComponent } from './components/user/user-register/user-register.component';
import { UserUpdateComponent } from './components/user/user-update/user-update.component';
import { UserViewProfileComponent } from './components/user/user-view-profile/user-view-profile.component';
import { ResetPassComponent } from './components/user/reset-pass/reset-pass.component';

import { ExperienciasComponent } from './components/experiencias/experiencias.component';
import { ExperienciasListComponent } from './components/experiencias/experiencias-list/experiencias-list.component';
import { ExperienciasSearchComponent } from './components/experiencias/experiencias-search/experiencias-search.component';
import { ExperienciasAddComponent } from './components/experiencias/experiencias-add/experiencias-add.component';
import { ExperienciasCreateComponent } from './components/experiencias/experiencias-create/experiencias-create.component';
import { EnlacesExternosComponent } from './components/enlaces-externos/enlaces-externos.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { TermsComponent } from './components/terms/terms.component';
import { PoliticsComponent } from './components/politics/politics.component';
import { AuthGuard } from './components/tools/auth';
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
    component: UserViewProfileComponent
  },
  { 
    path: 'userUpdate', 
    component: UserUpdateComponent,
    canActivate: [AuthGuard]
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
    component: ExperienciasCreateComponent
  },
  { 
    path: 'experiencias-search', 
    component: ExperienciasSearchComponent
  },
  { 
    path: 'enlaces-externos', 
    component: EnlacesExternosComponent
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