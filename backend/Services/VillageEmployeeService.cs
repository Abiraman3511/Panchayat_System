using Microsoft.EntityFrameworkCore;
using PanchayatApp.Data;
using PanchayatApp.Models;

namespace PanchayatApp.Services
{
    public interface IVillageEmployeeService
    {
        Task<List<VillageEmployee>> GetAllAsync();
        Task<VillageEmployee> AddAsync(VillageEmployee employee);
        Task<VillageEmployee?> UpdateAsync(int id, VillageEmployee employee);
        Task<bool> DeleteAsync(int id);
    }

    public class VillageEmployeeService : IVillageEmployeeService
    {
        private readonly AppDbContext _db;

        public VillageEmployeeService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<VillageEmployee>> GetAllAsync()
        {
            return await _db.VillageEmployees.ToListAsync();
        }

        public async Task<VillageEmployee> AddAsync(VillageEmployee employee)
        {
            _db.VillageEmployees.Add(employee);
            await _db.SaveChangesAsync();
            return employee;
        }

        public async Task<VillageEmployee?> UpdateAsync(int id, VillageEmployee employee)
        {
            var existing = await _db.VillageEmployees.FindAsync(id);
            if (existing == null) return null;

            existing.Name = employee.Name;
            existing.Designation = employee.Designation;
            existing.MobileNumber = employee.MobileNumber;
            existing.Address = employee.Address;
            existing.PhotoPath = employee.PhotoPath;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var employee = await _db.VillageEmployees.FindAsync(id);
            if (employee == null) return false;

            _db.VillageEmployees.Remove(employee);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
