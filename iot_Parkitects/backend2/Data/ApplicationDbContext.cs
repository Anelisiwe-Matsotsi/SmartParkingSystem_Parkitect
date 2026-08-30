using Microsoft.EntityFrameworkCore;
using backend2.Models;

namespace Backend2.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Settings> Settings { get; set; }
        public DbSet<Rating> Rating { get; set; }
    }
}