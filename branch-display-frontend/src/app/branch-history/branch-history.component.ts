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

  ngOnInit() {
    // create a new Vis.js DataSet to hold the data for our branch history
    const data = new DataSet();
    const edges = new DataSet<Edge>();

    // add nodes to the DataSet
    data.add({ id: 1, label: 'master' });
    data.add({ id: 2, label: 'feature-1' });
    data.add({ id: 3, label: 'feature-2' });
    data.add({ id: 4, label: 'feature-3' });
    data.add({ id: 5, label: 'hotfix-1' });

    // add edges to the DataSet to define the relationships between the nodes
    edges.add({ from: 1, to: 2 });
    edges.add({ from: 1, to: 3 });
    edges.add({ from: 2, to: 4 });
    edges.add({ from: 1, to: 5 });

    // create a new Vis.js Network instance and attach it to the branchHistory element
    const options = {};
    const network = new Network(this.branchHistory.nativeElement, {nodes:data, edges:edges}, options);
  }
}

