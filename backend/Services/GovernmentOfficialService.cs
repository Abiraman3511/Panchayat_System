using Microsoft.EntityFrameworkCore;
using PanchayatApp.Data;
using PanchayatApp.Models;

namespace PanchayatApp.Services
{
    public interface IGovernmentOfficialService
    {
        Task<List<GovernmentOfficial>> GetAllAsync();
        Task<GovernmentOfficial> AddAsync(GovernmentOfficial official);
        Task<GovernmentOfficial?> UpdateAsync(int id, GovernmentOfficial official);
        Task<bool> DeleteAsync(int id);
    }

    public class GovernmentOfficialService : IGovernmentOfficialService
    {
        private readonly AppDbContext _db;

        public GovernmentOfficialService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<GovernmentOfficial>> GetAllAsync()
        {
            return await _db.GovernmentOfficials.ToListAsync();
        }

        public async Task<GovernmentOfficial> AddAsync(GovernmentOfficial official)
        {
            _db.GovernmentOfficials.Add(official);
            await _db.SaveChangesAsync();
            return official;
        }

        public async Task<GovernmentOfficial?> UpdateAsync(int id, GovernmentOfficial official)
        {
            var existing = await _db.GovernmentOfficials.FindAsync(id);
            if (existing == null) return null;

            existing.Name = official.Name;
            existing.Position = official.Position;
            existing.PhotoPath = official.PhotoPath;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var official = await _db.GovernmentOfficials.FindAsync(id);
            if (official == null) return false;

            _db.GovernmentOfficials.Remove(official);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
