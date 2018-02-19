import { Component, OnInit } from '@angular/core';
import { ExpService } from './../../experiencias/exp.service';

@Component({
  selector: 'app-ambitos-list',
  templateUrl: './ambitos-list.component.html',
  styleUrls: ['./ambitos-list.component.css']
})
export class AmbitosListComponent implements OnInit {

  ambitos: any
  constructor(
    private _expService: ExpService
  ) { 
    _expService.getAmbitos().subscribe((ambitosList) => {
      this.ambitos = ambitosList
    })
  }

  ngOnInit() {
  }

}
