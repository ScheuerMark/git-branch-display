import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GitApiService } from '../git-api.service';
import { DataSet, Edge } from 'vis';
import { Network } from 'vis';


@Component({
  selector: 'app-branch-history',
  templateUrl: './branch-history.component.html',
  styleUrls: ['./branch-history.component.css']
})
export class BranchHistoryComponent implements OnInit {
  @Input() repoLink: string;
  @ViewChild('branchGraph') branchGraph: any;

  loading: boolean = false;
  branches: any[] = [];

  constructor(private gitApiService: GitApiService) {this.repoLink="https://github.com/ScheuerMark/test-branches" }

  ngOnInit(): void {
    this.loading = true;
    this.gitApiService.getBranchHistory(this.repoLink)
      .subscribe(data => {
        this.branches = data;
        console.log(data)
        this.loading = false;
        this.drawBranchGraph();
      });
  }

  drawBranchGraph() {
    const nodes = new DataSet();
    const edges = new DataSet<Edge>();
  
    this.branches.forEach((branch: any) => {
      const node = {
        id: branch.name,
        label: branch.name,
        shape: "box",
      };
      nodes.add(node);
    });

        // Add edges to show merges
        this.branches.forEach((branch: any) => {
          if (branch.merge_commit_sha) {
            const edge = {
              from: branch.merge_commit_sha,
              to: branch.name,
              arrows: "to",
            };
            edges.add(edge);
          }
        });
    
        const container = this.branchGraph.nativeElement;
        const data = { nodes: nodes, edges: edges };
        const options = {};
        const network = new Network(container, data, options);
  }
}
