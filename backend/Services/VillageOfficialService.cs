using Microsoft.EntityFrameworkCore;
using PanchayatApp.Data;
using PanchayatApp.Models;

namespace PanchayatApp.Services
{
    public interface IVillageOfficialService
    {
        Task<List<VillageOfficial>> GetAllAsync();
        Task<VillageOfficial> AddAsync(VillageOfficial official);
        Task<VillageOfficial?> UpdateAsync(int id, VillageOfficial official);
        Task<bool> DeleteAsync(int id);
    }

    public class VillageOfficialService : IVillageOfficialService
    {
        private readonly AppDbContext _db;

        public VillageOfficialService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<VillageOfficial>> GetAllAsync()
        {
            return await _db.VillageOfficials.ToListAsync();
        }

        public async Task<VillageOfficial> AddAsync(VillageOfficial official)
        {
            _db.VillageOfficials.Add(official);
            await _db.SaveChangesAsync();
            return official;
        }

        public async Task<VillageOfficial?> UpdateAsync(int id, VillageOfficial official)
        {
            var existing = await _db.VillageOfficials.FindAsync(id);
            if (existing == null) return null;

            existing.Name = official.Name;
            existing.Position = official.Position;
            existing.MobileNumber = official.MobileNumber;
            existing.Address = official.Address;
            existing.PhotoPath = official.PhotoPath;
            existing.StartDate = official.StartDate;
            existing.EndDate = official.EndDate;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var official = await _db.VillageOfficials.FindAsync(id);
            if (official == null) return false;

            _db.VillageOfficials.Remove(official);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
