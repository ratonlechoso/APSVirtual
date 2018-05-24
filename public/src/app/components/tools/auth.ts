import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

// import the auth service here
import { AuthService } from '../../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  // add the service we need
  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let roles = next.data["roles"] as Array<Number>;
    console.log("roles en CanActivate: ", roles)
    return this.auth.verifyForRoles([roles]).map(res => {
      if (res['success'] == true) {
        console.log('permiso de enrutamiento', res['success'])
        return true;
      } else {
        // redirect the user

        console.log("Ruta protegida. No tienes permiso. RES: ", res)
        switch (res['code']) {
          case 'err_001': {     //Fallo al autenticar el token. Token caducado?
            alert("Sesión caducada");
            this.auth.logout();
            this.router.navigate(['/login']);
            break;
          }
          case 'err_002': {     //No autenticado
            alert("Aun no te has autenticado. Acceso restringido a esta sección");
            this.router.navigate(['/login']);
            break;
          }
          case 'err_003': {     //Error en acceso a la tabla Users
            alert("Error " + res['message']);
            break;
          }
          case 'err_004': {     //Usuario bloqueado
            alert("Error " + res['message']);
            this.router.navigate(['/home']);
            break;
          }
          case 'err_005': {       //Privilegios insuficientes
            alert("Error " + res['message']);
            this.router.navigate(['/home']);
            break;
          }
          default:
            break;
        }

        if (res['success'] == "false1") {
          alert("Sesión caducada")
          this.router.navigate(['/login']);
        } else if (res['success'] == "false2") {

        }
        return false;
      }
    });
  }
}