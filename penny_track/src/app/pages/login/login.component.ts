import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiService } from '../../service/api.service';
import { User } from '../../class/user';
import { UserLog } from '../../class/log';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {

  @Output() login_popup = new EventEmitter();
  @Output() hide_nav = new EventEmitter();
  @Output() v_title = new EventEmitter();

  loginform: FormGroup;
  submitted = false;
  loginError: any;
  
  userlogs: UserLog[];

  focus1;
  focus2;

  //for OnInit
  newlogs: UserLog = { 
    logID: null,
    userID: null,
    userStat: null,
    userSession: null,
    createDTTM: null
  };
  //for login form
  loginupdate: UserLog = { 
    logID: null,
    userID: null,
    userStat: null,
    userSession: null,
    createDTTM: null
  };

  constructor(
    private apiService: ApiService, 
    private router: Router, 
    private formBuilder: FormBuilder
  ) {}

  close(){
    this.login_popup.emit(false);
  }

  toRegister() {
    this.login_popup.emit(false);
    this.v_title.emit("Register");
    localStorage.setItem('vis_title',"Register");
  }

  ngOnInit(): void { 

    localStorage.removeItem('new_registed'); 
    //prevent login popup dont blocking the screen after reload

    this.loginform = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      passwords: ['', Validators.required] 
    }, {});
    
    var session = this.getRandomString(28);

    if (localStorage.getItem('sessionID') == null || localStorage.getItem('sessionID') == undefined) {
      //new user session
      this.newlogs.userStat = 0;
      this.newlogs.userSession = session;
      this.apiService.addLog(this.newlogs).subscribe((lognew: UserLog)=>{
        console.log("New session ->", session);
        localStorage.setItem('sessionID',session);
        // stay on login
      })
    } else {
      //existed user session
      console.log("Ho! Mukatte kuru no ka?");
      
      //check user credential 
      var session_exist = localStorage.getItem('sessionID');

      this.apiService.getUserLog(session_exist).subscribe((logs: UserLog[])=>{
        
        if (logs.length < 1 || logs == undefined) { //loged out session

          this.newlogs.userStat = 0;
          this.newlogs.userSession = session_exist;
          this.apiService.addLog(this.newlogs).subscribe((lognew: UserLog)=>{
            console.log("Session Update ->", session_exist);
          });

        } else {
          this.userlogs = logs;

          if (logs[0]['userStat'] == 1) { //loged user

            if (logs[0]['userID'] !== null) { //has userID
              
              this.router.navigate(['user']);
              this.login_popup.emit(false); //close popup
              this.hide_nav.emit(false); //hide main nav

              console.log("Auto Loged In! Welcome Back.");

            } else { //empty userID
              return; // stay on login
            }
          } else { //loged out user
            return; // stay on login
          }
        }
      }); 

    }
  }

  get f() { return this.loginform.controls; }

  getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  login(form) {

    // console.log("Submitted ->",form)

    this.submitted = true;

    // stop if form is invalid
    if (this.loginform.invalid) {
      this.loginError = 'Invalid Login';
      return;
    }

    var email = form.value.email;
    var password = form.value.passwords;
    

    this.apiService.getUserLogin(email,password).subscribe((user: User)=>{
      // console.log("User" , user);

      if(user[0] == null) {
        // console.log("User not found");
        this.loginError = 'Incorrect Email or Password';
        
        return; // stay and show error popup

      } else {
        // console.log("User Matched!");
        // update user log based on sessionID
        
        localStorage.setItem('hide_nav',"1");
        localStorage.setItem('user_lock',"1");
        localStorage.setItem('uid',user[0]['userID']);
        localStorage.setItem('uname',user[0]['userName']);
        // console.log(user[0]);
        
        this.loginupdate.userStat = 1;
        this.loginupdate.userID = user[0]['userID'];
        this.loginupdate.userSession = localStorage.getItem('sessionID');
        // console.log(this.loginupdate);

        this.apiService.updateLog(this.loginupdate).subscribe((policy: UserLog)=>{
          console.log("Login Success! Log update ->" , policy);
        });

        this.router.navigate(['user'])
        this.login_popup.emit(false); //close popup
        this.hide_nav.emit(false); //hide main nav

      }
    });

  }

}
