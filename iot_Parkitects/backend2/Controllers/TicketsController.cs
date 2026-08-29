using backend2.Data;
using backend2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

//Emeris School of Computer Science, 2025
namespace backend2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TicketsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Ticket
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Ticket>>> GetAll()
        {
            return await _context.Tickets.ToListAsync();
        }

        // GET: api/Contract/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Ticket>> GetById(int id)
        {
            var ticket = await _context.Tickets.FindAsync();

            if (ticket == null)
            
                return NotFound();
            

            return ticket;
        }

        // POST: api/Tickets
        [HttpPost]
        public async Task<ActionResult<Ticket>> Create(Ticket ticket)
        {
            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = ticket.ticketID }, ticket);
        }
        //PUT: api/Contract/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Ticket ticket)
        {
            if (id != ticket.ticketID)
            
                return BadRequest();
            

            _context.Entry(ticket).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Tickets.Any(e => e.ticketID == id))
                
                    return NotFound();
                
                
                
                    throw;
                }
          

            return NoContent();
        }

        // DELETE: api/Tickets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
                return NotFound();
            

            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
/** 
References
Emeris School of Computer Science. 2025. PROG7311 Docker part 1 - Getting started. (Version 10.0) [Source Code]. Available at: <https://youtu.be/ldfC-rTzHPY?si=znsmPz-ZSPaY-4Ii> [Accessed 5 June 2026]
Emeris School of Computer Science. 2025. PROG7311 Docker part 2- connecting between the two!. (Version 10.0) [Source Code]. Available at: <https://youtu.be/_0EhC3WauAc?si=nEazkCpBTV1YpHBp> [Accessed 5 June 2026]
Emeris School of Computer Science. 2025. PROG7311 Docker part 3- databases in docker. (Version 10.0) [Source Code]. Available at: <https://youtu.be/6tYEbngWY-E?si=10rSEEpfSNL5Kg8k> [Accessed 5 June 2026]
Emeris School of Computer Science. 2025. PROG7311 Docker part 4- connecting to database from the API.(Version 10.0) [Source Code]. Available at: <https://youtu.be/_PwpPMoeqzw?si=Q0ELlPZdN42dFU9q> [Accessed 5 June 2026]
Emeris School of Computer Science. 2025. PROG7311 Docker part 5- connecting them all together- DB -API -MVC. (Version 10.0) [Source Code]. Available at: <https://youtu.be/YlIajRMdLPk?si=D75XZKO-L6nQhR-3> [Accessed 5 June 2026]

*/
