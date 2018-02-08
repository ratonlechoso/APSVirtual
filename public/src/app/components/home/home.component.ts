import { Component, OnInit} from '@angular/core';
import { AuthService } from './../../auth.service';
import { User } from './../user/user';
import * as moment from 'moment';

import { Subscription }   from 'rxjs/Subscription';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: User; 
  ahora:moment.Moment;
  ahoraFormatted: string;
  subscriptionToGetUser: Subscription;
  message: String;

  constructor(authService: AuthService) { 
    this.user = authService.user;
    authService.user$.subscribe( (user) => {
      this.user = user;
     });
 
  }

  ngOnInit() {
    this.ahora = moment().locale('es')
    this.ahoraFormatted = this.ahora.format('DD MMMM YYYY, h:mm:ss a')
  }
}
