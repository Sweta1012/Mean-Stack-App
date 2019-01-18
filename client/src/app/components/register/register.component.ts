
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  messageClass;
  message;


  constructor(  private formBuilder: FormBuilder, 
    private authService: AuthService,
    private router : Router
  ) { 
    this.createForm(); //Every time this component loads this method is invoked and is linked with html.
     }
  
  createForm(){
    this.form = this.formBuilder.group({
      username: ['', Validators.required],// you can give any default value but we are keeping it empty
      email:['', Validators.required],
      password: ['', Validators.required]// in order to use these we need to add "fromControlName=""" attribute in reg html file.it has to match name att and one which is declared here.
    })
  }

  onRegisterSubmit(){
    
    const user = {
      username: this.form.get('username').value,
      email: this.form.get('email').value,
      password: this.form.get('password').value
    }
   this.authService.registerUser(user).subscribe(data =>{
    if(!data.success){
      this.messageClass= " alert alert-danger"
      this.message= data.message;
     
    } else{
      this.messageClass= " alert alert-success"
      this.message= data.message;
      this.router.navigate(['/login']);
    }
   })
  }

  ngOnInit() {
    
  }

}
