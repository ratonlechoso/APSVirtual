import { Component, OnInit } from '@angular/core';
import { User } from './../user/user';
import { AuthService } from './../../auth.service';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {
  user: User
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.user = this.authService.user;
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

}
