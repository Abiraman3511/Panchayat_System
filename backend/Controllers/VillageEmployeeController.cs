using Microsoft.AspNetCore.Mvc;
using PanchayatApp.Models;
using PanchayatApp.Services;

namespace PanchayatApp.Controllers
{
    [ApiController]
    [Route("api/employees")]
    public class VillageEmployeeController : ControllerBase
    {
        private readonly IVillageEmployeeService _service;

        public VillageEmployeeController(IVillageEmployeeService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] VillageEmployee employee)
        {
            if (!Request.Headers.ContainsKey("X-Is-Admin") || Request.Headers["X-Is-Admin"] != "true")
            {
                return Unauthorized(new { message = "Admin privileges required." });
            }

            var created = await _service.AddAsync(employee);
            return Ok(created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] VillageEmployee employee)
        {
            if (!Request.Headers.ContainsKey("X-Is-Admin") || Request.Headers["X-Is-Admin"] != "true")
            {
                return Unauthorized(new { message = "Admin privileges required." });
            }

            var updated = await _service.UpdateAsync(id, employee);
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
