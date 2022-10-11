import { Routes } from '@angular/router';

import { IndexComponent } from "./pages/index/index.component";
import { InsightComponent } from "./pages/insight/insight.component";
import { ExpenseComponent } from "./pages/expense/expense.component";
import { ProfilepageComponent } from "./pages/profilepage/profilepage.component";


export const USER_CHILD_ROUTES: Routes = [
    
    { path: "", component: IndexComponent },
    { path: "insight", component: InsightComponent },
    { path: "expense", component: ExpenseComponent },
    { path: "profile", component: ProfilepageComponent }
    
]