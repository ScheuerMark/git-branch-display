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

   const branchToGroup: Record<string, number> = {}; 
   let groupCount = 0;

   this.gitApiService.getBranchHistory("https://github.com/ScheuerMark/test-branches").subscribe((commitHistory: any) => {
     for (const sha in commitHistory) {
      const commit = commitHistory[sha];
      const branch = commit.commit.sourceBranch;
      let groupId = branchToGroup[branch];
      if (groupId === undefined) { 
        groupId = groupCount;
        groupCount++;
        branchToGroup[branch] = groupId;
      }
      data.add({ id: sha, label: commit.commit.shortMessage, group: groupId, type:'node'  });
      for (const parent of commit.parents) {
        edges.add({ from: sha, to: parent.commit.sha });
      }
    }

    const groupOptions: { [id: string]: { color: string} } = {};
    for (const branch in branchToGroup) {
      const groupId = branchToGroup[branch];
      groupOptions[groupId] = { color: this.getGroupColor(branch) }; 
    }

     const options = {
      groups: groupOptions,
      layout: {
        hierarchical: {
          direction: 'LR',
          nodeSpacing: 100,
          sortMethod: 'directed',
        },
        alignment: 'center',
      },
      interaction: {
        dragNodes: false,
        dragView: false,
      },
    };
     const network = new Network(this.branchHistory.nativeElement, { nodes: data, edges: edges }, options);
   });
  }

  getGroupColor(branch: string): string {
    const colors = [
      "#F94144",
      "#F3722C",
      "#F8961E",
      "#F9C74F",
      "#90BE6D",
      "#43AA8B",
      "#577590",
      "#4D4D4D",
    ];
    const index = Math.abs(this.hashCode(branch)) % colors.length;
    return colors[index];
  }

  hashCode(str: string): number {
    let hash = 0;
    if (str.length === 0) {
      return hash;
    }
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }
}

