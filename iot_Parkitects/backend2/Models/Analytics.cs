namespace backend2.Models
{
    // Formats the response for the frontend insight cards
    public class AnalyticsSummary
    {
        public int TicketsIssued { get; set; }
        public int TicketsResolved { get; set; }
        public double AvgResolutionTimeHours { get; set; }
    }

    // Formats the response for the frontend table rows
    public class ParkingHistory
    {
        public string? Bay { get; set; }
        public string? User { get; set; }
        public string? UserType { get; set; }
        public string? TimeIn { get; set; }
        public string? TimeOut { get; set; }
        public string? Duration { get; set; }
        public string? Status { get; set; }
    }
}