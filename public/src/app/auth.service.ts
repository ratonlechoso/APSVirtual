import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable }     from 'rxjs/observable';
import { User } from './components/user/user';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  //private base_url = 'http://localhost:8080/api/user';
  private base_url = 'api/user';
  
  token: string;
  private userSource = new Subject<User>();
  user$ = this.userSource.asObservable();

  user: User;

  constructor(public http: Http) { }

  getLocalUser(): any {
    if (this.user != null)
//    console.log(this.user.first_name)
    return this.user;
  }

  setUser(user: User) {
    console.log("pasa por setUser")
    this.user = user
    this.userSource.next(user);
    //this.user$ = this.userSource.asObservable();
  }

  registerUser(user: User): Observable<boolean> {
    let body = JSON.stringify(user); 
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(`${this.base_url}/register`, body, options).map( (res) => this.setToken(res) );
  }

  loginUser(user): Observable<Object> {
    let body = JSON.stringify(user);
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(`${this.base_url}/login`, body, options).map( (res) =>  this.setToken(res) );
  }

  forgotPwd(user): Observable<Object> {
    let body = JSON.stringify(user);
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(`${this.base_url}/forgot`, body, options).map( (res) =>  this.parseRes(res) );
  }

  resetPwd(token, user): Observable<Object> {
    let body = JSON.stringify(user);
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(`${this.base_url}/reset/`+ token, user, options).map( (res) =>  this.parseRes(res) );
  }
  
  logout() {
    this.setUser(null)
    this.user = null
    this.token = null;
    localStorage.removeItem('currentUser');
  }

  verify(): Observable<Object> {
    let currUser = JSON.parse(localStorage.getItem('currentUser')); 
    let token = ( currUser && 'token' in currUser) ? currUser.token : this.token;
    let headers = new Headers({ 'x-access-token': token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.base_url}/check-state`, options).map( res => this.parseRes(res) );
  }

  verifyForRoles(id_rol): Observable<Object> {
    console.log("roles: ", id_rol)
    console.log("user: ", this.user)
    let currUser = JSON.parse(localStorage.getItem('currentUser')); 
    let token = ( currUser && 'token' in currUser) ? currUser.token : this.token;
    let userId = ( currUser && 'id' in currUser) ? currUser.id : null;
    console.log("userId en lS: ", userId)
    let headers = new Headers({ 'x-access-token': token });
    headers.append('x-access-roles', id_rol )
    headers.append('x-access-id', userId )
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.base_url}/check-state`, options).map( res => this.parseRes(res) );
  }


  setToken(res){ 
    let body = JSON.parse(res['_body']);
    if( body['success'] == true ){
      this.token = body['token'];
      //localStorage.setItem('CurrentUserEmail', body['user']['email'])
      localStorage.setItem('currentUser', JSON.stringify({ 
        id: body['user']['id'],
        email: body['user']['email'], 
        token: this.token 
      }));
    }
    return body;
  }

  parseRes(res){
    let body = JSON.parse(res['_body']);
    return body;
  }

}
