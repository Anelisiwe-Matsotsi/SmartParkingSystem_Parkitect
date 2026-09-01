using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend2.Data;
using backend2.Models;
using System.Threading.Tasks;

namespace backend2.Controllers
{
    // Sets up the API routing (Microsoft, 2026a)
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // A Data Transfer Object to safely receive the incoming JSON (Microsoft, 2026a)
        public class UserSyncDto
        {
            public string FirebaseUid { get; set; } = string.Empty;
            public string Name { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
        }

        [HttpPost("sync")]
        public async Task<IActionResult> SyncUser([FromBody] UserSyncDto dto)
        {
            if (string.IsNullOrEmpty(dto.FirebaseUid)) 
                return BadRequest("Firebase UID is required.");

            // Checks if this user already synced to avoid duplicates using Entity Framework (Microsoft, 2026b)
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.FirebaseUid == dto.FirebaseUid);
            
            if (existingUser == null)
            {
                var newUser = new User
                {
                    FirebaseUid = dto.FirebaseUid,
                    Name = dto.Name,
                    Email = dto.Email
                };
                
                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();
                
                return Ok(new { message = "User synced successfully", user = newUser });
            }

            return Ok(new { message = "User already exists", user = existingUser });
        }
    }
}

/* Reference list:

   Microsoft, 2026a. Create web APIs with ASP.NET Core. [online] Available at: <https://learn.microsoft.com/en-us/aspnet/core/web-api/?view=aspnetcore-10.0> [Accessed 30 August 2026].
   
   Microsoft, 2026b. Entity Framework Core. [online] Available at: <https://learn.microsoft.com/en-us/ef/core/> [Accessed 30 August 2026].

*/