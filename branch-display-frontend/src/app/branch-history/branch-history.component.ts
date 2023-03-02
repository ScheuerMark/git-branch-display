import { Component, Input, OnInit, ViewChild,ElementRef  } from '@angular/core';
import { GitApiService } from '../git-api.service';
import { DataSet, Edge, Node } from 'vis';
import { Network } from 'vis';
import * as dagre from 'dagre';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-branch-history',
  templateUrl: './branch-history.component.html',
  styleUrls: ['./branch-history.component.css']
})
export class BranchHistoryComponent implements OnInit {
  @ViewChild('branchHistory', { static: true }) branchHistory!: ElementRef;

  constructor(
    private gitApiService: GitApiService,
    private route: ActivatedRoute,
    ) {}

  ngOnInit() {
   const data = new DataSet();
   const edges = new DataSet<Edge>();
   let encodedLink = this.route.snapshot.queryParamMap.get('link');
   let link = decodeURIComponent(encodedLink!);
   console.log(link);
   const branchToGroup: Record<string, number> = {}; 
   let groupCount = 0;
   let x = 0;

   this.gitApiService.getBranchHistory(`https://github.com/${link}`).subscribe((commitHistory: any) => {
     for (const sha in commitHistory) {
      const commit = commitHistory[sha];
      const branch = commit.commit.sourceBranch;
      let groupId = branchToGroup[branch];
      if (groupId === undefined) { 
        groupId = groupCount;
        groupCount++;
        branchToGroup[branch] = groupId;
      }
      console.log(commitHistory[sha]);
      data.add({ id: sha, label: shortenLabel(commit.commit.shortMessage,15), group: groupId,y: (groupId*50),x: (x*150),});
      for (const parent of commit.parents) {
        edges.add({ from: parent.commit.sha, to: sha });
      }
      x++;
    }

    const groupOptions: { [id: string]: { color: string} } = {};
    for (const branch in branchToGroup) {
      const groupId = branchToGroup[branch];
      groupOptions[groupId] = { color: getGroupColor(branch) }; 
    }

    const options = {
      autoResize: true,
      groups: groupOptions,
      width:"97vw",
      height:"100%",
      layout: {
        randomSeed:1,
        improvedLayout:true,
        hierarchical: {
          enabled:false
        },
      },
      nodes:{
        fixed: {x:true,y:true},
        shape:"box",
      },
      edges:{
        arrows: {
          to: {
            enabled: true,
            type:"arrow",
            scaleFactor:0.7
          }
        }
      },
      interaction: {
        dragNodes: false,
        dragView: true,
      },
      physics:{
        enabled:false,
      }
    };
     const network = new Network(this.branchHistory.nativeElement, { nodes: data, edges: edges }, options);
     
   });
  }

}

function shortenLabel(label : string, maxLength : number) {
  if (label.length > maxLength) {
    return label.substring(0, maxLength) + '...';
  } else {
    return label;
  }
}

function hashCode(str: string): number {
  let hash = 0;
  if (str.length === 0) {
    return hash;
  }
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}

function getGroupColor(branch: string): string {
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
  const index = Math.abs(hashCode(branch)) % colors.length;
  return colors[index];
}

