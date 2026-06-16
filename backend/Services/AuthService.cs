using Microsoft.Extensions.Caching.Memory;
using PanchayatApp.Data;
using PanchayatApp.Models;
using Microsoft.EntityFrameworkCore;

namespace PanchayatApp.Services
{
    public interface IAuthService
    {
        Task<string> SendOtpAsync(string email);
        Task<bool> RegisterWithOtpAsync(RegisterRequest request);
        Task<User?> LoginAsync(LoginRequest request);
        Task<User?> AdminLoginAsync(LoginRequest request);
    }

    public class AuthService : IAuthService
    {
        private readonly AppDbContext _db;
        private readonly IMemoryCache _cache;
        private readonly IEmailService _emailService;

        public AuthService(AppDbContext db, IMemoryCache cache, IEmailService emailService)
        {
            _db = db;
            _cache = cache;
            _emailService = emailService;
        }

        public async Task<string> SendOtpAsync(string email)
        {
            var otp = new Random().Next(100000, 999999).ToString();
            _cache.Set($"OTP_{email}", otp, TimeSpan.FromMinutes(10));
            var message = $"Your registration OTP for Panchayat System is: {otp}. It is valid for 10 minutes.";
            
            // Bypass email sending to prevent Render Free Tier crash
            // await _emailService.SendEmailAsync(email, "Panchayat System Registration OTP", message);
            
            return otp;
        }

        public async Task<bool> RegisterWithOtpAsync(RegisterRequest request)
        {
            if (await _db.Users.AnyAsync(u => u.Username == request.Username))
            {
                return false; // Username taken
            }

            if (!_cache.TryGetValue($"OTP_{request.Email}", out string? savedOtp) || savedOtp != request.OtpCode)
            {
                throw new ArgumentException("Invalid or expired OTP.");
            }

            var newUser = new User
            {
                Username = request.Username,
                HashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                IsAdmin = false
            };

            _db.Users.Add(newUser);
            await _db.SaveChangesAsync();

            _cache.Remove($"OTP_{request.Email}");
            return true;
        }

        public async Task<User?> LoginAsync(LoginRequest request)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.HashedPassword))
            {
                return null;
            }
            return user;
        }

        public async Task<User?> AdminLoginAsync(LoginRequest request)
        {
            var admin = await _db.Users.FirstOrDefaultAsync(u => u.Username == request.Username && u.IsAdmin);
            if (admin == null || !BCrypt.Net.BCrypt.Verify(request.Password, admin.HashedPassword))
            {
                return null;
            }
            return admin;
        }
    }
}
