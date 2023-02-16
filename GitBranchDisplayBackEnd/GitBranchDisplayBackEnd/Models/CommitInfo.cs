namespace GitBranchDisplayBackEnd.Models
{
    public class CommitInfo
    {
        public string Sha { get; set; }
        public string Message { get; set; }
        public string Author { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
