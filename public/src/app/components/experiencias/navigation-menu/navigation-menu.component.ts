import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './../../user/user';
import { AuthService } from '../../../auth.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.css']
})

export class NavigationMenuComponent implements OnInit, OnDestroy {
  user: User
  subscriptionToGetUser: Subscription
  constructor(
    private router: Router,
    authService: AuthService
  ) {
    this.user = new User();
    if (authService.user != null) {
      this.user = authService.user;
    } else {
      this.subscriptionToGetUser = authService.user$.subscribe((user) => {
        this.user = user
      })
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subscriptionToGetUser != null)
      this.subscriptionToGetUser.unsubscribe();
  }

}
