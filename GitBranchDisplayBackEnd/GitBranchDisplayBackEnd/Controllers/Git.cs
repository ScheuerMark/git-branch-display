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

        [HttpGet]
        public Dictionary<string, CommitNode> GetCommitHistory(string repoLink)
        {
            var tempDirectory = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName());
            LibRepository.Clone(repoLink, tempDirectory);

            var commitNodes = new Dictionary<string, CommitNode>();

            var commitSourceBranches = GetCommitsSource(tempDirectory);

            using (var repo = new LibRepository(tempDirectory))
            {
                void AddParentCommits(LibCommit commit)
                {
                    foreach (var parent in commit.Parents)
                    {
                        if (!commitNodes.ContainsKey(parent.Sha))
                        {
                            var parentCommitNode = new CommitNode(new Models.Commit()
                            {
                                Sha = parent.Sha,
                                Message = parent.Message,
                                ShortMessage = parent.MessageShort,
                                SourceBranch = commitSourceBranches.FirstOrDefault(x => x.Sha == parent.Sha)?.Branch
                            });

                            commitNodes.Add(parent.Sha, parentCommitNode);

                            AddParentCommits(parent);
                        }
                    }
                }

                foreach (LibCommit commit in repo.Commits)
                {
                    var commitNode = new CommitNode(new Models.Commit()
                    {
                        Sha = commit.Sha,
                        Message = commit.Message,
                        ShortMessage = commit.MessageShort,
                        SourceBranch = commitSourceBranches.FirstOrDefault(x => x.Sha == commit.Sha).Branch,

                    });

                    AddParentCommits(commit);

                    if (!commitNodes.ContainsKey(commit.Sha))
                    {
                        commitNodes.Add(commit.Sha, commitNode);
                    }
                    else
                    {
                        commitNodes[commit.Sha] = commitNode;
                    }

                    foreach (LibCommit parent in commit.Parents)
                    {
                        string parentSha = parent.Sha;
                        if (commitNodes.ContainsKey(parentSha))
                        {
                            commitNode.Parents.Add(commitNodes[parentSha]);
                        }
                    }
                }
            }

            return commitNodes;
        }


        private List<CommitSourceBranch>? GetCommitsSource(string tempDirectory)
        {
            var commitSourceBranches = new List<CommitSourceBranch>();
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

