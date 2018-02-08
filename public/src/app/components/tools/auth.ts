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
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        return this.auth.verify().map(res =>{
            if (res['success'] == true) {
                console.log('permiso de enrutamiento',  res['success'])
                return true;
            } else {
                // redirect the user
                console.log("Ruta protegida. No tienes permiso. RES: ", res['success'])
                this.router.navigate(['/login']);
                return false;
            }
          //  }).catch(() => {
          //    this.router.navigate(['/login']);
          //    return Observable.of(false);
        });
 
  }
}