import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { User } from '../user';
import { Router } from '@angular/router';
import { AuthService } from './../../../auth.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-user-view-profile',
  templateUrl: './user-view-profile.component.html',
  styleUrls: ['./user-view-profile.component.css']
})
export class UserViewProfileComponent implements OnInit, OnDestroy {
  subscriptionToVerify: Subscription
  user: User

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.user = new User();
    console.log("constructor de view-profile")
    //this.user = this.authService.getLocalUser();
    if (authService.user != null) {
      console.log(authService.user.first_name);
      this.user = this.authService.user;
    } else {
      console.log("user-view-profile: Error. No se ha cargado el usaurio. Se")
      this.subscriptionToVerify = authService.user$.subscribe((user) => {
        console.log("pasa por subscribe user")
        this.user = user
      })
    }
  }

  edit() {
    this.router.navigate(['userUpdate']);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subscriptionToVerify != null)
      this.subscriptionToVerify.unsubscribe();
  }


}
