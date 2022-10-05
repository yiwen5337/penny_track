import { Component, OnInit, OnDestroy } from "@angular/core";
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit, OnDestroy {

  v_title = "About Us";
  isCollapsed = true;

  constructor(
    private titleService:Title
  ) {}

  scrollToDownload(element: any) {
    element.scrollIntoView({ behavior: "smooth" });
  }

  ngOnInit(): void {
    this.titleService.setTitle(this.v_title);

    var body = document.getElementsByTagName("body")[0];
    body.classList.add("landing-page"); //"index-page" class for the background animation

  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("landing-page"); //destory the animation for saving resource 
  }
}
