using Microsoft.EntityFrameworkCore;
using backend2.Models;

namespace backend2.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // Tells Entity Framework to create a "Users" table (Microsoft, 2026)
        public DbSet<User> Users { get; set; }
    }
}

/*
Reference List:

Microsoft, 2026. Entity Framework Core. [online] Available at: <https://learn.microsoft.com/en-us/ef/core/> [Accessed 30 August 2026].

*/