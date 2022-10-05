import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

  v_title = "Welcome";
  isCollapsed = true;
  openModal: boolean = false;
  logedNav: boolean; //to hide navbar after user login
  nav: any;
  new_reg: any;

  constructor(  
  ) { }

  @HostListener("window:scroll", ["$event"])

  onWindowScroll(e) {
    if (window.pageYOffset > 100) {
      var element = document.getElementById("navbar-top");
      if (element) {
        element.classList.remove("navbar-transparent");
        element.classList.add("bg-info");
      }
    } else {
      var element = document.getElementById("navbar-top");
      if (element) {
        element.classList.add("navbar-transparent");
        element.classList.remove("bg-info");
      }
    }
  }

  popup() {
    this.openModal = !this.openModal;
  }

  ngOnInit() {
    this.onWindowScroll(event);

    this.new_reg = localStorage.getItem('new_registed');
    this.v_title = localStorage.getItem('vis_title');
    this.nav = JSON.parse(localStorage.getItem('hide_nav'));

    if ( this.new_reg == '1') {
      this.openModal = true;
    }

    if ( this.nav == '1' ) {
      this.logedNav = false;
    } else {
      this.logedNav = true;
    }

  }

  changeTitle(number) {
    if (number == 1) {
      this.v_title = "About Us";
      localStorage.setItem('vis_title',"About Us");
    } else if (number == 2) {
      this.v_title = "Contact Us";
      localStorage.setItem('vis_title',"Contact Us");
    } else if (number == 3) {
      this.v_title = "Register";
      localStorage.setItem('vis_title',"Register");
    } else {
      this.v_title = "Welcome";
      localStorage.setItem('vis_title',"Welcome");
    }
  }

}
