namespace GitBranchDisplayBackEnd.Models
{
    public class MergeInfo
    {
        public string From { get; set; }
        public string To { get; set; }
        public string Message { get; set; }
        public string Author { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
