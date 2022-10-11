import { Component, OnInit, OnDestroy } from "@angular/core";
import { Title } from '@angular/platform-browser';

import { ApiService } from '../../service/api.service';
import { User } from '../../class/user';
import { UserData } from '../../class/userdata';

@Component({
  selector: "app-profilepage",
  templateUrl: "profilepage.component.html"
})
export class ProfilepageComponent implements OnInit, OnDestroy {

  title = "Profile";
  isCollapsed = true;
  uID: any;
  userName: any;

  users: User[];
  userdata: UserData[];
  saving: any;
  spending: any;
  
  constructor(
    private titleService:Title,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.titleService.setTitle(this.title);
    
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("profile-page");

    this.uID = JSON.parse(localStorage.getItem('uid'));
    this.userName = localStorage.getItem('uname');

    this.apiService.getUser(this.uID).subscribe((userdata: User[]) => {
      this.users = userdata;

    })

    this.apiService.getUserData(this.uID,0).subscribe((userdata: UserData[]) => {
      this.userdata = userdata;

      var savingdata = 0;
      var spendingdata = 0;

      for ( var row in this.userdata ){

        if (this.userdata[row]['typeID'] == '0') {
          savingdata ++ ;

        } else {
          spendingdata ++;

        }
      }

      this.saving = savingdata;
      this.spending = spendingdata;

    })
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("profile-page");
  }
}
