namespace GitBranchDisplayBackEnd.Models
{
    public class Commit
    {
        public string? Sha { get; set; }
        public string? Message { get; set; }
        public string? ShortMessage { get; set; }

        public string? SourceBranch { get; set; }
    }
}
