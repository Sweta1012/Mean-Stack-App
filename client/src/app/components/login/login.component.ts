import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,  Validators, FormControl } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  messageClass;
  message;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router : Router
  )
   { 
    this.createForm();
  }


  createForm(){
    this.form = this.formBuilder.group({
      username: ['', Validators.required],// you can give any default value but we are keeping it empty
      password: ['', Validators.required]// in order to use these we need to add "fromControlName=""" attribute in login html file.it has to match name att and one which is declared here.
    })
  }

  onLoginSubmit(){

    const user = {
      username: this.form.get('username').value,
      password: this.form.get('password').value
    }

    this.authService.login(user).subscribe(data =>{ 
      if(!data.success){
        this.router.navigate(['/login']);
       this.messageClass ="alert alert-danger";
       this.message = data.message;
      } else{
       
        this.messageClass="alert alert-success";
        this.message = data.message;
        this.authService.storeUserData(data.token, data.user, data.isLoggedIn);
        this.router.navigate(['/dashboard']);
      }
     });
   

  }

  ngOnInit() {
  }

}
