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
            // Query the raw data from the database using primitive types (Microsoft, 2026)
            var rawHistory = await _context.ParkingSessions
                .Join(_context.Users, session => session.userID, user => user.UserId, (session, user) => new { session, user })
                .Join(_context.ParkingBays, combined => combined.session.bayID, bay => bay.bayID, (combined, bay) => new 
                {
                    BayNumber = bay.bayNumber,
                    UserName = combined.user.Name,
                    UserRole = combined.user.UserRole,
                    StartDate = combined.session.startDate,
                    EndDate = combined.session.endDate
                })
                // Order by the actual DateTime object before converting it to a string
                .OrderByDescending(h => h.StartDate) 
                .ToListAsync(); // Executes the SQL query and pulls the raw data into server memory

            // Format the data into strings
            var history = rawHistory.Select(h => new ParkingHistory
            {
                Bay = h.BayNumber,
                User = h.UserName,
                UserType = h.UserRole,
                TimeIn = h.StartDate.ToString("hh:mm tt"),
                TimeOut = h.EndDate.HasValue ? h.EndDate.Value.ToString("hh:mm tt") : "—",
                Duration = h.EndDate.HasValue ? 
                    $"{(h.EndDate.Value - h.StartDate).Hours}h {(h.EndDate.Value - h.StartDate).Minutes}m" : "Active",
                Status = h.EndDate.HasValue ? "Completed" : "Parked"
            }).ToList();

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