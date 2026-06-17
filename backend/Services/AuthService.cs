using Microsoft.Extensions.Caching.Memory;
using PanchayatApp.Data;
using PanchayatApp.Models;
using Microsoft.EntityFrameworkCore;

namespace PanchayatApp.Services
{
    public interface IAuthService
    {
        Task<bool> RegisterAsync(RegisterRequest request);
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

        public async Task<bool> RegisterAsync(RegisterRequest request)
        {
            if (await _db.Users.AnyAsync(u => u.Username == request.Username))
            {
                return false; // Username taken
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
