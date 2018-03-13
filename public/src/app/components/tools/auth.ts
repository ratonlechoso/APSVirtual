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
        alert (res['message'])
        //this.router.navigate(['/login']);
        return false;
      }
    });
  }
}