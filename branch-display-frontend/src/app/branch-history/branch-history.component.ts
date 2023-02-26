import { Component, Input, OnInit, ViewChild,ElementRef  } from '@angular/core';
import { GitApiService } from '../git-api.service';
import { DataSet, Edge } from 'vis';
import { Network } from 'vis';


@Component({
  selector: 'app-branch-history',
  templateUrl: './branch-history.component.html',
  styleUrls: ['./branch-history.component.css']
})
export class BranchHistoryComponent implements OnInit {
  @ViewChild('branchHistory', { static: true }) branchHistory!: ElementRef;

  constructor(private gitApiService: GitApiService) {}

  ngOnInit() {
   const data = new DataSet();
   const edges = new DataSet<Edge>();

   this.gitApiService.getBranchHistory("https://github.com/ScheuerMark/test-branches").subscribe((branchHistory: any) => {
     for (const branch of branchHistory) {
       data.add({ id: branch.name, label: branch.name });
     }


     const options = {};
     const network = new Network(this.branchHistory.nativeElement, { nodes: data, edges: edges }, options);
   });
  }
}

