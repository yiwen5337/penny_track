import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from './auth-guard';

import { OverviewComponent } from "./pages/overview/overview.component";
import { RegisterpageComponent } from "./pages/registerpage/registerpage.component";
import { ContactComponent } from "./pages/contact/contact.component";
import { AboutComponent } from "./pages/about/about.component";
import { UserComponent } from "./pages/user/user.component";
import { USER_CHILD_ROUTES } from './user-routing';

const routes: Routes = [
  { path: "", redirectTo: "welcome", pathMatch: "full" },
  { path: "welcome", component: OverviewComponent },
  { path: "register", component: RegisterpageComponent },
  { path: "support", component: ContactComponent },
  { path: "about", component: AboutComponent },
  { path: "user", component: UserComponent, canActivate:[AuthGuard], children: USER_CHILD_ROUTES }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
