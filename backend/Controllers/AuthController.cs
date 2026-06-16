using Microsoft.AspNetCore.Mvc;
using PanchayatApp.Models;
using PanchayatApp.Services;

namespace PanchayatApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpRequest request)
        {
            var otp = await _authService.SendOtpAsync(request.Email);
            if (!string.IsNullOrEmpty(otp)) return Ok(new { message = "OTP generated.", otp = otp });
            return StatusCode(500, new { message = "Failed to generate OTP." });
        }

        [HttpPost("verify-otp")] // Replacing old '/register' for unified routing
        public async Task<IActionResult> VerifyOtp([FromBody] RegisterRequest request)
        {
            try
            {
                var success = await _authService.RegisterWithOtpAsync(request);
                if (success) return Ok(new { message = "Registration successful." });
                return BadRequest(new { message = "Username already exists." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _authService.LoginAsync(request);
            if (user == null) return Unauthorized(new { message = "Invalid credentials." });
            return Ok(new { message = "Login successful.", token = "dummy-jwt-token", isAdmin = user.IsAdmin, user = new { user.Id, user.Username, user.Email, user.PhoneNumber } });
        }

        [HttpPost("admin-login")]
        public async Task<IActionResult> AdminLogin([FromBody] LoginRequest request)
        {
            var admin = await _authService.AdminLoginAsync(request);
            if (admin == null) return Unauthorized(new { message = "Invalid admin credentials." });
            return Ok(new { message = "Admin login successful.", admin = new { admin.Id, admin.Username } });
        }
    }
}
