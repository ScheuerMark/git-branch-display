using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using GitBranchDisplayBackEnd.Models;
using LibGit2Sharp;

namespace GitBranchDisplayBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Git : ControllerBase
    {
        [HttpGet]
        public ActionResult<List<BranchInfo>> Get(string repoLink)
        {
            var branchInfoList = new List<BranchInfo>();
            var tempDirectory = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName());

            // Clone the repository to a temporary directory
            Repository.Clone(repoLink, tempDirectory);


            using (var repo = new Repository(tempDirectory))
            {
                // Retrieve branch history for each branch
                foreach (var branch in repo.Branches)
                {
                    var branchInfo = new BranchInfo
                    {
                        Name = branch.FriendlyName,
                        Commits = new List<CommitInfo>()
                    };

                    var branchCommits = repo.Commits.QueryBy(new CommitFilter
                    {
                        IncludeReachableFrom = branch.Tip,
                        ExcludeReachableFrom = branch.Tip.Parents.FirstOrDefault()
                    });

                    foreach (var commit in branchCommits)
                    {
                        var commitInfo = new CommitInfo
                        {
                            Sha = commit.Sha,
                            Message = commit.Message,
                            Author = commit.Author.Name,
                            Timestamp = commit.Author.When.LocalDateTime
                        };

                        branchInfo.Commits.Add(commitInfo);
                    }

                    branchInfoList.Add(branchInfo);
                }
            }


            return branchInfoList;
        }
    }
}
