
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { tokenNotExpired } from 'angular2-jwt';
 
@Injectable({providedIn: 'root'})
 
export class AuthService {
  
  user;
  authtoken;
  options;

  constructor(
    private http : Http
  ) { }

  //to loadtokens
  loadtoken(){
    this.authtoken= localStorage.getItem('token');
  }

  //call this service to the paths you need to attach this header.
  createAuthenticationHeader(){
    this.loadtoken();
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json',
        'authtoken': this.authtoken
      })
    });
  } 

  //fn to register user accs
registerUser(user){
 // api is running on port 8080
 return this.http.post('http://localhost:8080/authentication/register', user).pipe(map(res => res.json()));
}

//login fun
login(user){
  return this.http.post('http://localhost:8080/authentication/login', user).pipe(map(res => res.json())); 
}

//logout
logout(){
  this.authtoken = null;
  this.user = null;
  localStorage.clear();
}

// fn to store user data on browser side
storeUserData(token, user, isLoggedIn){
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('isLoggedIn', isLoggedIn);
 this.user = user;
}
// to check if token is present in LS and as valid
loggedIn() {
  return tokenNotExpired();
}

getprofile(){
  this.createAuthenticationHeader();
 return this.http.get('http://localhost:8080/authentication/profile', this.options).pipe(map(res => res.json()));
}


}
