
namespace GitBranchDisplayBackEnd.Models
{
    public class CommitNode
    {
        public Commit Commit { get; set; }
        public List<CommitNode> Parents { get; set; }

        public CommitNode(Commit commit)
        {
            Commit = commit;
            Parents = new List<CommitNode>();
        }
    }
}
