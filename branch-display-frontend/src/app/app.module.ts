import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BranchHistoryComponent } from './branch-history/branch-history.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RepoInputComponent } from './repo-input/repo-input.component';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

const routes: Routes = [
  { 
    path: '', component: RepoInputComponent
  },
  {
    path:'History/:link', component: BranchHistoryComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    BranchHistoryComponent,
    RepoInputComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
