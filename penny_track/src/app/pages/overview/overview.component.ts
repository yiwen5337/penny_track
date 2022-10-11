import { Component, OnInit, OnDestroy } from "@angular/core";
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { ApiService } from '../../service/api.service';
import { UserLog } from '../../class/log';

@Component({
  selector: 'app-overview',
  templateUrl: 'overview.component.html'
})
export class OverviewComponent implements OnInit, OnDestroy {

  title = "Welcome";
  isCollapsed = true;

  userlogs: UserLog[];
  //for OnInit
  newlogs: UserLog = { 
    logID: null,
    userID: null,
    userStat: null,
    userSession: null,
    createDTTM: null
  };

  constructor(
    private apiService: ApiService, 
    private router: Router,
    private titleService: Title
  ) { }

  scrollToDownload(element: any) {
    element.scrollIntoView({ behavior: "smooth" });
  }

  ngOnInit(): void {

    this.titleService.setTitle(this.title);

    var body = document.getElementsByTagName("body")[0];
    body.classList.add("index-page"); //"index-page" class for the background animation

    //detecting loged in user
    if (localStorage.getItem('sessionID') == null || localStorage.getItem('sessionID') == undefined) {
      //do nothing, let it handle by login component
    } else {
      //existed user session
      console.log("Session Detected!");
      
      //check user credential 
      var session_exist = localStorage.getItem('sessionID');

      this.apiService.getUserLog(session_exist).subscribe((logs: UserLog[])=>{
        
        if (logs.length < 1 || logs == undefined) { //loged out session
          //do nothing, let it handle by login component
        } else {
          this.userlogs = logs;
          if (logs[0]['userStat'] == 1) { //loged user

            if (logs[0]['userID'] !== null) { //has userID
              //redirect to user
              this.router.navigate(['user']);
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

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("index-page"); //destory the animation for saving resource 
  }

}
