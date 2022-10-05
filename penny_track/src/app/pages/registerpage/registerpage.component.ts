import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { ApiService } from '../../service/api.service';
import { User } from '../../class/user';

@Component({
  selector: "app-registerpage",
  templateUrl: "registerpage.component.html"
})
export class RegisterpageComponent implements OnInit, OnDestroy {

  registerform: FormGroup;
  submitted = false;
  registerError: any;

  v_title = "Register";
  isCollapsed = true;
  focus;
  focus1;
  focus2;
  focus3;
  
  fieldTextType;
  fieldTextType2;

  newuser: User = { 
    userID: null,
    userName: null,
    userEmail: null,
    userPassword: null,
    createDTTM: null
  };
  
  constructor(
    private titleService:Title,
    private apiService: ApiService, 
    private router: Router, 
    private formBuilder: FormBuilder
  ) {}

  @HostListener("document:mousemove", ["$event"])

  onMouseMove(e) {
    var squares1 = document.getElementById("square1");
    var squares2 = document.getElementById("square2");
    var squares3 = document.getElementById("square3");
    var squares4 = document.getElementById("square4");
    var squares5 = document.getElementById("square5");
    var squares6 = document.getElementById("square6");
    var squares7 = document.getElementById("square7");
    var squares8 = document.getElementById("square8");

    var posX = e.clientX - window.innerWidth / 2;
    var posY = e.clientY - window.innerWidth / 6;

    squares1.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.05 +
      "deg) rotateX(" +
      posY * -0.05 +
      "deg)";
    squares2.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.05 +
      "deg) rotateX(" +
      posY * -0.05 +
      "deg)";
    squares3.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.05 +
      "deg) rotateX(" +
      posY * -0.05 +
      "deg)";
    squares4.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.05 +
      "deg) rotateX(" +
      posY * -0.05 +
      "deg)";
    squares5.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.05 +
      "deg) rotateX(" +
      posY * -0.05 +
      "deg)";
    squares6.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.05 +
      "deg) rotateX(" +
      posY * -0.05 +
      "deg)";
    squares7.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.02 +
      "deg) rotateX(" +
      posY * -0.02 +
      "deg)";
    squares8.style.transform =
      "perspective(500px) rotateY(" +
      posX * 0.02 +
      "deg) rotateX(" +
      posY * -0.02 +
      "deg)";
  }

  ngOnInit() {
    this.titleService.setTitle(this.v_title);

    var body = document.getElementsByTagName("body")[0];
    body.classList.add("register-page");

    this.registerform = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['',  [Validators.required, Validators.email] ],
      passwords: ['', Validators.required],
      conf_passwords: ['', Validators.required]    
    }, {});

    this.onMouseMove(event);
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("register-page");
  }

  // Switching method
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  toggleFieldTextType2() {
    this.fieldTextType2 = !this.fieldTextType2;
  }

  get f() { return this.registerform.controls; }

  
  register(form) {

    console.log("Submitted ->",form)

    this.submitted = true;

    // stop if form is invalid
    if (this.registerform.invalid) {
      this.registerError = 'Invalid Registration';
      // console.log("Form invalid");
      return;
    }

    var username = form.value.username;
    var email = form.value.email;
    var password = form.value.passwords;
    var conf_password = form.value.conf_passwords;

    // stop if password confirmation not matched
    if (password != conf_password) {
      this.registerError = 'Confirm Password Not Matched.';
      // console.log("Password confirmation not matched");
      return;
    }

    this.apiService.checkEmail(email).subscribe((user: User)=>{
    
      if(user[0] == null) {
        
        this.newuser.userName = username;
        this.newuser.userEmail = email ;
        this.newuser.userPassword = password;
    
        this.apiService.addUser(this.newuser).subscribe((newuser: User)=>{
          // console.log("User" , user);
    
          if(newuser == null) {
            // console.log("Register fail");
            this.registerError = '<b> Error! - </b>Failed to Register, Try Again.';
            // stay and show error popup
    
          } else {
            // console.log("Register success");
            
            localStorage.setItem('new_registed',"1"); //open login popup
            this.router.navigate(['welcome']).then(() => {
              window.location.reload();
            });;
          }
        });

      } else {
        this.registerError = 'Email Has Already Been Taken.';
        // console.log("Email has taken");
        return;
      }
    });
  }
  
}
