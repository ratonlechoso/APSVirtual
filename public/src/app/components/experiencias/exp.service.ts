import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';//Para manejar los verbos http

import { Experiencia } from './experiencia';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs'; //se implementan los observables para manejar las promesas

@Injectable()
export class ExpService {
  base_url = 'http://localhost:3567/api/exp';
  constructor(public _http: Http
  ) { }

  getAmbitos(): Observable<Object> {
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    console.log("Accediendo al endpoint GET experiencias")
    return this._http.get(`${this.base_url}/ambitos`, options).map(res => this.parseRes(res));
  }

  getEspecialidades(id): Observable<Object> {
    let headers = new Headers({ 'x-access-token': id });
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    console.log("Accediendo al endpoint GET experiencias")
    return this._http.get(`${this.base_url}/especialidades`, options).map(res => this.parseRes(res));
  }

  getUniversidades(): Observable<Object> {
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    console.log("Accediendo al endpoint GET Universidades")
    return this._http.get(`${this.base_url}/universidades`, options).map(res => this.parseRes(res));
  }

  getExperiencias(id): Observable<Object> {
    let headers = new Headers({ 'x-access-token': id });
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    console.log("Accediendo al endpoint GET experiencias")
    return this._http.get(`${this.base_url}/experiencias`, options).map(res => this.parseRes(res));
  }

  createExperiencia(exp: Experiencia): Observable<Object> {
    console.log(exp)
    let body = JSON.stringify(exp);
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this._http.post(`${this.base_url}/experiencias`, body, options).map( (res) => this.parseRes(res) );
  }

  deleteExperiencia(id: String): Observable<Object> {
    let headers = new Headers({ 'x-access-token': id });
    let options = new RequestOptions({ headers: headers });
    return this._http.delete(`${this.base_url}/experiencias/`, options).map( (res) => this.parseRes(res) );
  }

  parseRes(res) {
    let body = JSON.parse(res['_body']);
    return body;
  }


}