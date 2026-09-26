using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend2.Models;
using backend2.Data;

namespace backend2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : Controller
    {
        
        private ApplicationDbContext _context;
        
        public NotificationController(ApplicationDbContext context)
        {
            _context = context;
        }
    }
}