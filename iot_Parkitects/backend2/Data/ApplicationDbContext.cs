using Microsoft.EntityFrameworkCore;
using backend2.Models;

namespace backend2.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

       public DbSet<Ticket> Tickets { get; set; }
       
    }
}