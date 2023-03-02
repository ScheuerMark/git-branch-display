import { Component,OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-repo-input',
  templateUrl: './repo-input.component.html',
  styleUrls: ['./repo-input.component.css']
})
export class RepoInputComponent{
  constructor(
    private router: Router,
    
  ) {}

  link : string = "";
  send(){
    console.log(this.link);
    this.router.navigate(['History/:link'], {queryParams: {link:encodeURIComponent(this.link.split("/").slice(-2).join("/")) }});
  }
}
