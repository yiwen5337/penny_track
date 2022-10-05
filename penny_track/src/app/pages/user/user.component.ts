import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../../service/api.service';
import { UserLog } from '../../class/log';
import { UserData } from '../../class/userdata';
import { Target } from '../../class/target';
import { Daycounts } from '../../class/daycount';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {

  title: any;
  isCollapsed = true;
  uID: any;
  userName: any;

  targetExist: boolean = false;
  targetSucceed: boolean = false;
  eachDay: any;
  totalPostSaving: any;
  totalPostSpending: any;
  daysorday: any;

  userlog: UserLog = { 
    logID: null,
    userID: null,
    userStat: null,
    userSession: null,
    createDTTM: null
  };

  targets: Target = { 
    targetID: null,
    userID: null,
    salary: null,
    target: null,
    payday: null,
    targetDate: null,
    targetStat: null,
    createDTTM: null
  };

  daysdiff: Daycounts ={
    days: null,
    months: null
  }

  constructor(
    private router: Router, 
    private apiService: ApiService
  ) { }

  ngOnInit(): void {

    this.title = localStorage.getItem('doc_title');

    this.uID = JSON.parse(localStorage.getItem('uid'));
    this.userName = localStorage.getItem('uname');

    //Get all targets by userID
    this.apiService.getTarget(this.uID).subscribe((target: Target[]) => {

      if (target.length < 1 || target == undefined) {
        this.targetExist = false;
        //show set target form
      } else {
        this.targetExist = true;

        this.targets.targetID = target[0]['targetID'];
        this.targets.target = target[0]['target'];
        this.targets.targetDate = target[0]['targetDate'];
        this.targets.salary = target[0]['salary'];
        this.targets.payday = target[0]['payday'];
        this.targets.createDTTM = target[0]['createDTTM'];
        // console.log(this.targets);

        //Calulation
        this.apiService.getCountdown(this.uID).subscribe((days: Daycounts[]) => {
          this.daysdiff.days = days[0]['days'];
          this.daysdiff.months = days[0]['months'];
          // console.log(this.daysdiff);

          var day = Number(this.daysdiff.days);
          if ( day > 1) {
            this.daysorday = "Days";
          } else {
            this.daysorday = "Day";
          }

          //Get all post target savings
          this.apiService.getPostSaving(this.uID,this.targets.targetDate,this.targets.createDTTM).subscribe((amounts: UserData[]) => {
            // console.log(amounts);

            var post_saving = [];
            for ( var item in amounts ){
              post_saving.push( amounts[item]['amount'] );
            }
            this.totalPostSaving = post_saving.reduce((acc, cur) => acc + Number(cur), 0)
            // console.log(this.totalPostSaving);

            //Get all post target spendings
            this.apiService.getPostSpending(this.uID,this.targets.targetDate,this.targets.createDTTM).subscribe((amounts: UserData[]) => {
              // console.log(amounts);
  
              var post_saving = [];
              for ( var item in amounts ){
                post_saving.push( amounts[item]['amount'] );
              }
              this.totalPostSpending = post_saving.reduce((acc, cur) => acc + Number(cur), 0)
              // console.log(this.totalPostSpending);
              
              //Main calulation
              var sub = Number(this.targets.target) - this.totalPostSaving + this.totalPostSpending; //Saving(-) Spending(+)
              var divided: any = sub / this.daysdiff.days;
              this.eachDay = parseFloat(divided).toFixed(2) 
              //average saving each day to reach the target

              if ( this.eachDay <= 0 ){
                //target complete
                this.targetSucceed = true;

              }
            })
          })
        })
        
      }
    })

  }

  logout() {
    //clear localstorage 
    localStorage.removeItem('uid');
    localStorage.removeItem('user_lock');
    localStorage.removeItem('uname');
    localStorage.removeItem('hide_nav');
    localStorage.setItem('doc_title',"Home"); //set back default Home
    localStorage.setItem('vis_title',"Welcome"); //set back vistor default 

    localStorage.setItem('graph_filter','0'); //0 is default
    localStorage.setItem('graph_title',"All Time"); //Reset insight page title

    this.userlog.userID = null;
    this.userlog.userStat = 0;
    this.userlog.userSession = localStorage.getItem('sessionID');
    // console.log(this.userlog);

    //update member log
    this.apiService.updateLog(this.userlog).subscribe((policy: UserLog)=>{
      console.log("Logout Success! Log update ->" , policy);
      this.router.navigate(['welcome']).then(() => {
        window.location.reload();
      });;

    });

  }

  changeTitle(number) {
    if (number == 1) {
      this.title = "Expense";
      localStorage.setItem('doc_title',"Expense");
    } else if (number == 2) {
      this.title = "Insight";
      localStorage.setItem('doc_title',"Insight");
    }else if (number == 3) {
      this.title = "Profile";
      localStorage.setItem('doc_title',"Profile");
    } else {
      this.title = "Home";
      localStorage.setItem('doc_title',"Home");
    }
  }

}
