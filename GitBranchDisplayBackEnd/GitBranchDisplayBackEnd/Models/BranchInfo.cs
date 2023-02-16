namespace GitBranchDisplayBackEnd.Models
{
    public class BranchInfo
    {
        public string Name { get; set; }
        public string LatestCommitSha { get; set; }
        public string LatestCommitAuthor { get; set; }
        public DateTime LatestCommitTimestamp { get; set; }
        public string LatestCommitMessage { get; set; }
        public List<CommitInfo> Commits { get; set; }
        public List<MergeInfo> Merges { get; set; }
    }
}
