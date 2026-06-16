using Microsoft.AspNetCore.Mvc;
using PanchayatApp.Models;
using PanchayatApp.Services;

namespace PanchayatApp.Controllers
{
    [ApiController]
    [Route("api/government-officials")]
    public class GovernmentOfficialController : ControllerBase
    {
        private readonly IGovernmentOfficialService _service;

        public GovernmentOfficialController(IGovernmentOfficialService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] GovernmentOfficial official)
        {
            if (!Request.Headers.ContainsKey("X-Is-Admin") || Request.Headers["X-Is-Admin"] != "true")
            {
                return Unauthorized(new { message = "Admin privileges required." });
            }

            var created = await _service.AddAsync(official);
            return Ok(created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] GovernmentOfficial official)
        {
            if (!Request.Headers.ContainsKey("X-Is-Admin") || Request.Headers["X-Is-Admin"] != "true")
            {
                return Unauthorized(new { message = "Admin privileges required." });
            }

            var updated = await _service.UpdateAsync(id, official);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (!Request.Headers.ContainsKey("X-Is-Admin") || Request.Headers["X-Is-Admin"] != "true")
            {
                return Unauthorized(new { message = "Admin privileges required." });
            }

            var deleted = await _service.DeleteAsync(id);
            if (!deleted) return NotFound();
            return Ok(new { message = "Deleted successfully." });
        }
    }
}
