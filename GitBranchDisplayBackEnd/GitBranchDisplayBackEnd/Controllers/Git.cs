using Microsoft.AspNetCore.Mvc;
using Octokit;

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
        public async Task<IActionResult> GetBranchHistory(string repoLink)
        {
            var github = new GitHubClient(new ProductHeaderValue("my-app"));

            // Parse the URL to extract the owner and repository names
            var uri = new Uri(repoLink);
            var segments = uri.Segments;
            var owner = segments[1].TrimEnd('/');
            var repo = segments[2].TrimEnd('/');

            // Get the list of branches for the repository
            var branches = await github.Repository.Branch.GetAll(owner, repo);

            // For each branch, get the list of commits
            var branchCommits = new List<List<GitHubCommit>>();
            foreach (var branch in branches)
            {
                var commits = await github.Repository.Commit.GetAll(owner, repo, new CommitRequest { Sha = branch.Name });
                branchCommits.Add(commits.ToList());
            }

            // Convert the data into a format that can be easily consumed by the frontend
            var branchHistory = new List<object>();
            for (int i = 0; i < branches.Count; i++)
            {
                var branch = branches[i];
                var commits = branchCommits[i];

                var branchData = new
                {
                    name = branch.Name,
                    commitCount = commits.Count,
                    commits = commits.Select(commit => new
                    {
                        hash = commit.Sha,
                        author = commit.Author.Login,
                        date = commit.Commit.Author.Date,
                        message = commit.Commit.Message,
                        parentHashes = commit.Parents.Select(parent => parent.Sha).ToList()
                    }).ToList()
                };
                branchHistory.Add(branchData);
            }

            return Ok(branchHistory);
        }
    }
}
