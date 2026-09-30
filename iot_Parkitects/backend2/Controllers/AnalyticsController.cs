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
            // Joins ParkingSessions, Users, and ParkingBays tables to construct the table rows in the analytics page on the web app
            var history = await _context.ParkingSessions
                .Join(_context.Users, session => session.userID, user => user.UserId, (session, user) => new { session, user })
                .Join(_context.ParkingBays, combined => combined.session.bayID, bay => bay.bayID, (combined, bay) => new ParkingHistory
                {
                    Bay = bay.bayNumber,
                    User = combined.user.Name,
                    UserType = combined.user.UserRole,
                    TimeIn = combined.session.startDate.ToString("hh:mm tt"),
                    TimeOut = combined.session.endDate.HasValue ? combined.session.endDate.Value.ToString("hh:mm tt") : "—",
                    Duration = combined.session.endDate.HasValue ? 
                        $"{(combined.session.endDate.Value - combined.session.startDate).Hours}h {(combined.session.endDate.Value - combined.session.startDate).Minutes}m" : "Active",
                    Status = combined.session.endDate.HasValue ? "Completed" : "Parked"
                })
                .OrderByDescending(h => h.TimeIn) // Show newest first
                .ToListAsync();

            return Ok(history);
        }

        // GET: api/analytics/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummaryStats()
        {
            var tickets = await _context.Tickets.ToListAsync();
            
            var summary = new AnalyticsSummary
            {
                TicketsIssued = tickets.Count,
                TicketsResolved = tickets.Count(t => t.status == "Resolved"),
                AvgResolutionTimeHours = tickets
                    .Where(t => t.status == "Resolved" && t.updatedAt.HasValue)
                    .Average(t => (t.updatedAt.Value - t.createdAt).TotalHours)
            };

            return Ok(summary);
        }
    }
}

/*
Reference List: 

Microsoft. 2026. Entity Framework Core overview - EF Core | Microsoft Learn. [Online] Available at: <https://learn.microsoft.com/en-us/ef/core/> [Accessed 30 Sep. 2026].

*/