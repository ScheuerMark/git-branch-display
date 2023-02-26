using System.Diagnostics;
using GitBranchDisplayBackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Octokit;
using LibGit2Sharp;
using LibBranch = LibGit2Sharp.Branch;
using LibCommit = LibGit2Sharp.Commit;
using LibRepository = LibGit2Sharp.Repository;

namespace GitBranchDisplayBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Git : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public Git(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }


        [HttpGet("commits")]
        public List<CommitSourceBranch>? GetAllCommits(string repoLink)
        {
            var tempDirectory = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName());
            var commitSourceBranches = new List<CommitSourceBranch>();

            LibRepository.Clone(repoLink, tempDirectory);

            using (var repo = new LibRepository(tempDirectory))
            {

                // Execute `git log --branches --source` command
                var startInfo = new ProcessStartInfo("git",@"log --pretty=format:""%H %S"" --all --source")
                {
                    WorkingDirectory = tempDirectory,
                    RedirectStandardOutput = true,
                    UseShellExecute = false
                };

                using (var process = Process.Start(startInfo))
                {
                    var output = process.StandardOutput.ReadToEnd();
                    var lines = output.Split("\n");
                    foreach (var line in lines)
                    {
                        var parts = line.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
                        if (parts.Length == 2 && (parts[1].StartsWith("refs/heads/") || parts[1].StartsWith("refs/remotes/origin/")))
                        {
                            commitSourceBranches.Add(new CommitSourceBranch
                            {
                                Sha = parts[0],
                                Branch = parts[1].Replace("refs/heads/", "").Replace("refs/remotes/origin/", "")
                            });
                        }
                    }
                }
            }

            return commitSourceBranches;
        }




    }
        
}

