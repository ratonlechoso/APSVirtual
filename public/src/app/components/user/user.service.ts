import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';//Para manejar los verbos http

import { User } from './user';
import { AuthService} from './../../auth.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs'; //se implementan los observables para manejar las promesas

@Injectable()
export class UserService {
  //private base_url = 'http://localhost:8080/api/user';
  private base_url = '/api/user';
  auth: AuthService;
  constructor(
    private _http: Http,
  ) { }

  //Todos los metodos de la API devuelven promesas.

  create(user: User) {
    return this._http.post('/users', user)
      .map(data => data.json()).toPromise()
  }

  detroy(user: User) {
    return this._http.delete('/users/' + user.id)
      .map(data => data.json()).toPromise()
  }

  getUsers(): Observable<Object> {
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this._http.get(`${this.base_url}/users`, options).map(res =>this.parseRes(res));
  }

  getRoles(): Observable<Object> {
    console.log("getRoles")
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this._http.get(`${this.base_url}/roles`, options)
    .map(res =>this.parseRes(res));
  }

  getUser(id: String): Observable<Object> {
    //getUser(id: string) {
    // return this._http.get(`${this.base_url}/getUser/` + id)
    // .map(data => data.json()).toPromise()
    console.log("pasa por getUser")
    let headers = new Headers({ 'x-access-token': id });
    let options = new RequestOptions({ headers: headers });

    return this._http.get(`${this.base_url}/getUser`, options)
      //.map(data => data.json()).toPromise()
      .map(res =>this.parseRes(res));
  }

  // registerUser(user: User): Observable<boolean> {
  //   let body = JSON.stringify(user);
  //   let headers = new Headers();
  // 	headers.append('Content-Type', 'application/json');
  //   let options = new RequestOptions({ headers: headers });
  //   return this._http.post(`${this.base_url}/register`, body, options).map( (res) => this.setToken(res) );
  // }

  registerUser(user: User): Observable<boolean> {
    let body = JSON.stringify(user);
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this._http.post(`${this.base_url}/register`, body, options).map( (res) => this.auth.setToken(res) );
  }

  update(user: User): Observable<Object> {
    console.log("usuario ", user)
    let body = JSON.stringify(user);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this._http.put(`${this.base_url}/user/` + user.id, body, options).map((res) => this.parseRes(res));
    // return this._http.put('/users/' + user.id, user)
    // .map(data => data.json()).toPromise()
  } 

  notificarActivacion(user: User): Observable<Object> {
    let body = JSON.stringify(user);
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this._http.post(`${this.base_url}/notify_activation`, body, options).map( (res) =>  this.parseRes(res) );
  }
  
  parseRes(res){
    console.log("parseRes->res", res) 
    let body = JSON.parse(res['_body']); 
    return body;
  }
} 