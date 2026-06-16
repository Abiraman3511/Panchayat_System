using Microsoft.AspNetCore.Mvc;
using PanchayatApp.Models;
using PanchayatApp.Services;

namespace PanchayatApp.Controllers
{
    [ApiController]
    [Route("api")]
    public class PeopleDirectoryController : ControllerBase
    {
        private readonly IPeopleDirectoryService _service;

        public PeopleDirectoryController(IPeopleDirectoryService service)
        {
            _service = service;
        }

        private bool IsAdmin()
        {
            return Request.Headers.ContainsKey("X-Is-Admin") && Request.Headers["X-Is-Admin"] == "true";
        }

        // --- Streets ---
        [HttpGet("streets")]
        public async Task<IActionResult> GetStreets() => Ok(await _service.GetStreetsAsync());

        [HttpPost("streets")]
        public async Task<IActionResult> AddStreet([FromBody] Street street)
        {
            if (!IsAdmin()) return Unauthorized();
            return Ok(await _service.AddStreetAsync(street));
        }

        [HttpPut("streets/{id}")]
        public async Task<IActionResult> UpdateStreet(int id, [FromBody] Street street)
        {
            if (!IsAdmin()) return Unauthorized();
            var res = await _service.UpdateStreetAsync(id, street);
            return res != null ? Ok(res) : NotFound();
        }

        [HttpDelete("streets/{id}")]
        public async Task<IActionResult> DeleteStreet(int id)
        {
            if (!IsAdmin()) return Unauthorized();
            var ok = await _service.DeleteStreetAsync(id);
            return ok ? Ok() : NotFound();
        }

        // --- Families ---
        [HttpGet("streets/{streetId}/families")]
        public async Task<IActionResult> GetFamilies(int streetId) => Ok(await _service.GetFamiliesByStreetAsync(streetId));

        [HttpPost("streets/{streetId}/families")]
        public async Task<IActionResult> AddFamily(int streetId, [FromBody] Family family)
        {
            if (!IsAdmin()) return Unauthorized();
            return Ok(await _service.AddFamilyAsync(streetId, family));
        }

        [HttpPut("families/{id}")]
        public async Task<IActionResult> UpdateFamily(int id, [FromBody] Family family)
        {
            if (!IsAdmin()) return Unauthorized();
            var res = await _service.UpdateFamilyAsync(id, family);
            return res != null ? Ok(res) : NotFound();
        }

        [HttpDelete("families/{id}")]
        public async Task<IActionResult> DeleteFamily(int id)
        {
            if (!IsAdmin()) return Unauthorized();
            var ok = await _service.DeleteFamilyAsync(id);
            return ok ? Ok() : NotFound();
        }

        // --- People ---
        [HttpGet("families/{familyId}/people")]
        public async Task<IActionResult> GetPeople(int familyId) => Ok(await _service.GetPeopleByFamilyAsync(familyId));

        [HttpPost("families/{familyId}/people")]
        public async Task<IActionResult> AddPerson(int familyId, [FromBody] Person person)
        {
            if (!IsAdmin()) return Unauthorized();
            return Ok(await _service.AddPersonAsync(familyId, person));
        }

        [HttpPut("people/{id}")]
        public async Task<IActionResult> UpdatePerson(int id, [FromBody] Person person)
        {
            if (!IsAdmin()) return Unauthorized();
            var res = await _service.UpdatePersonAsync(id, person);
            return res != null ? Ok(res) : NotFound();
        }

        [HttpDelete("people/{id}")]
        public async Task<IActionResult> DeletePerson(int id)
        {
            if (!IsAdmin()) return Unauthorized();
            var ok = await _service.DeletePersonAsync(id);
            return ok ? Ok() : NotFound();
        }

        [HttpPost("people/{id}/upload-photo")]
        public async Task<IActionResult> UploadPhoto(int id, IFormFile file)
        {
            if (!IsAdmin()) return Unauthorized();
            if (file == null || file.Length == 0) return BadRequest(new { message = "No file uploaded." });
            
            // Limit to 10MB
            if (file.Length > 10 * 1024 * 1024) return BadRequest(new { message = "File size exceeds 10MB limit." });

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
            var ext = Path.GetExtension(file.FileName).ToLower();
            if (!allowedExtensions.Contains(ext)) return BadRequest(new { message = "Invalid file extension. Only JPG and PNG are allowed." });

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "people");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = $"{id}_{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var photoPath = $"/uploads/people/{uniqueFileName}";
            var result = await _service.UpdatePersonPhotoAsync(id, photoPath);
            if (result) return Ok(new { photoPath = photoPath });
            return NotFound(new { message = "Person not found." });
        }

        [HttpGet("people/search")]
        public async Task<IActionResult> SearchPeople([FromQuery] string? query, [FromQuery] string? occupation, [FromQuery] int? minAge, [FromQuery] int? maxAge)
        {
            return Ok(await _service.SearchPeopleAsync(query, occupation, minAge, maxAge));
        }
    }
}
