//(Microsoft, 2026)
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend2.Data;
using backend2.Models;

namespace backend2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnalyticsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AnalyticsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/analytics/history
        [HttpGet("history")]
        public async Task<IActionResult> GetParkingHistory()
        {
            // Join the User and ParkingBay tables (Microsoft, 2026a)
            var rawHistory = await _context.ParkingSessions
                .Include(s => s.User)
                .Include(s => s.ParkingBay)
                .OrderByDescending(s => s.startDate)
                .ToListAsync();

            // Format the data into strings in-memory using the renamed ParkingHistory class (Microsoft, 2026b)
            var history = rawHistory.Select(h => new ParkingHistory
            {
                // Access the joined data directly through the navigation properties
                Bay = h.ParkingBay?.bayNumber ?? "Unknown",
                User = h.User?.UserNumber ?? "Unknown",
                UserType = h.User?.UserRole ?? "Unknown",
                TimeIn = h.startDate.ToString("hh:mm tt"),
                TimeOut = h.endDate.HasValue ? h.endDate.Value.ToString("hh:mm tt") : "—",
                Duration = h.endDate.HasValue ?
                    $"{(h.endDate.Value - h.startDate).Hours}h {(h.endDate.Value - h.startDate).Minutes}m" : "Active",
                Status = h.endDate.HasValue ? "Completed" : "Parked"
            }).ToList();

            return Ok(history);
        }

        // GET: api/analytics/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummaryStats()
        {
            var tickets = await _context.Tickets.ToListAsync();
            var totalTickets = tickets.Count;

            // Calculate Bar Chart Heights 
            var weeklyCounts = new int[7];

            foreach (var ticket in tickets)
            {
                // DayOfWeek starts at Sunday (0). We shift it so Monday is 0 and Sunday is 6.
                int dayIndex = ((int)ticket.createdAt.DayOfWeek + 6) % 7;
                weeklyCounts[dayIndex]++;
            }

            // Convert raw counts to percentages relative to the busiest day so the CSS bars scale correctly (Microsoft, 2026c)
            var maxDayCount = weeklyCounts.Max() == 0 ? 1 : weeklyCounts.Max();
            var weeklyChart = weeklyCounts.Select(count => (int)Math.Round((double)count / maxDayCount * 100)).ToArray();

            // Calculate the percentages for the violation chart
            int getPercentage(string reason) => totalTickets == 0 ? 0 :
                (int)Math.Round((double)tickets.Count(t => t.reason == reason) / totalTickets * 100);

            int rpPercent = getPercentage("Restricted parking");
            int loPercent = getPercentage("Lights are on");
            int vbPercent = getPercentage("Vehicle outside bay");
            int psPercent = getPercentage("Parked skew");
            int otherPercent = 100 - (rpPercent + vbPercent + psPercent); // Remainder

            // 
            var resolvedTickets = tickets.Where(t => t.status == "Resolved" && t.updatedAt.HasValue).ToList();

            // Create a variable to hold all the summary data to be returned
            var summary = new AnalyticsSummary
            {
                TicketsIssued = tickets.Count,
                TicketsResolved = tickets.Count(t => t.status == "Resolved"),
                AvgResolutionTimeHours = resolvedTickets.Any()
                    ? resolvedTickets.Average(t => (t.updatedAt!.Value - t.createdAt).TotalHours)
                    : 0,
                WeeklyChart = weeklyChart,
                ViolationBreakdown = new Dictionary<string, int>
                {
                    { "RP", rpPercent },
                    { "LO", loPercent },
                    { "VB", vbPercent },
                    { "PS", psPercent },
                    { "OT", otherPercent < 0 ? 0 : otherPercent } // Ensures that there are no negative values
                }
            };

            return Ok(summary);
        }
    }
}

/*
Reference List: 

Microsoft, 2026a. Loading Related Data - EF Core. [online] Available at: <https://learn.microsoft.com/en-us/ef/core/querying/related-data/> [Accessed 28 September 2026].
Microsoft, 2026b. Language Integrated Query (LINQ) in C#. [online] Available at: <https://learn.microsoft.com/en-us/dotnet/csharp/linq/> [Accessed 28 September 2026].
Microsoft, 2026c. Math.Round Method (System). [online] Available at: <https://learn.microsoft.com/en-us/dotnet/api/system.math.round> [Accessed 28 September 2026].

*/