namespace GitBranchDisplayBackEnd.Models
{
    public class BranchInfo
    {
        public string Name { get; set; }
        public List<CommitInfo> Commits { get; set; }
    }
}
