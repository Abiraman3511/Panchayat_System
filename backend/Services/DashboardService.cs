using Microsoft.EntityFrameworkCore;
using PanchayatApp.Data;

namespace PanchayatApp.Services
{
    public interface IDashboardService
    {
        Task<object> GetStatsAsync();
    }

    public class DashboardService : IDashboardService
    {
        private readonly AppDbContext _db;

        public DashboardService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<object> GetStatsAsync()
        {
            var totalPopulation = await _db.People.CountAsync();
            var totalFamilies = await _db.Families.CountAsync();
            var totalStreets = await _db.Streets.CountAsync();

            var populationByGender = await _db.People
                .GroupBy(p => p.Gender)
                .Select(g => new { name = g.Key, value = g.Count() })
                .ToListAsync();

            var populationByStreet = await _db.People
                .Where(p => p.Family != null && p.Family.Street != null)
                .GroupBy(p => p.Family!.Street!.Name)
                .Select(g => new
                {
                    name = g.Key,
                    Population = g.Count()
                })
                .OrderByDescending(s => s.Population)
                .Take(5)
                .ToListAsync();

            var maritalStats = await _db.People.GroupBy(p => p.MaritalStatus).Select(g => new { name = string.IsNullOrEmpty(g.Key) ? "Unknown" : g.Key, value = g.Count() }).ToListAsync();
            var casteStats = await _db.People.GroupBy(p => p.Caste).Select(g => new { name = string.IsNullOrEmpty(g.Key) ? "Unknown" : g.Key, value = g.Count() }).ToListAsync();
            var eduStats = await _db.People.GroupBy(p => p.Education).Select(g => new { name = string.IsNullOrEmpty(g.Key) ? "Unknown" : g.Key, value = g.Count() }).ToListAsync();

            var ageStats = new[] {
                new { name = "0-18", value = await _db.People.CountAsync(p => p.Age <= 18) },
                new { name = "19-35", value = await _db.People.CountAsync(p => p.Age > 18 && p.Age <= 35) },
                new { name = "36-60", value = await _db.People.CountAsync(p => p.Age > 35 && p.Age <= 60) },
                new { name = "60+", value = await _db.People.CountAsync(p => p.Age > 60) }
            };

            var administrators = await _db.VillageOfficials.CountAsync() + await _db.GovernmentOfficials.CountAsync();
            var employees = await _db.VillageEmployees.CountAsync();

            return new
            {
                summary = new { totalPopulation, totalFamilies, totalStreets, administrators, employees },
                streetData = populationByStreet.Select(s => new { name = s.name, population = s.Population }),
                genderStats = populationByGender,
                maritalStats,
                casteStats,
                ageStats,
                eduStats
            };
        }
    }
}
