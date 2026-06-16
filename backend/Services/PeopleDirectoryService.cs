using Microsoft.EntityFrameworkCore;
using PanchayatApp.Data;
using PanchayatApp.Models;

namespace PanchayatApp.Services
{
    public interface IPeopleDirectoryService
    {
        Task<List<Street>> GetStreetsAsync();
        Task<Street> AddStreetAsync(Street street);
        Task<Street?> UpdateStreetAsync(int id, Street street);
        Task<bool> DeleteStreetAsync(int id);

        Task<List<Family>> GetFamiliesByStreetAsync(int streetId);
        Task<Family> AddFamilyAsync(int streetId, Family family);
        Task<Family?> UpdateFamilyAsync(int id, Family family);
        Task<bool> DeleteFamilyAsync(int id);

        Task<List<Person>> GetPeopleByFamilyAsync(int familyId);
        Task<Person> AddPersonAsync(int familyId, Person person);
        Task<Person?> UpdatePersonAsync(int id, Person person);
        Task<bool> DeletePersonAsync(int id);

        Task<object> SearchPeopleAsync(string? query, string? occupation, int? minAge, int? maxAge);
        Task<bool> UpdatePersonPhotoAsync(int id, string photoPath);
    }

    public class PeopleDirectoryService : IPeopleDirectoryService
    {
        private readonly AppDbContext _db;

        public PeopleDirectoryService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<Street>> GetStreetsAsync() => await _db.Streets.ToListAsync();

        public async Task<Street> AddStreetAsync(Street street)
        {
            _db.Streets.Add(street);
            await _db.SaveChangesAsync();
            return street;
        }

        public async Task<Street?> UpdateStreetAsync(int id, Street street)
        {
            var existing = await _db.Streets.FindAsync(id);
            if (existing == null) return null;
            existing.Name = street.Name;
            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteStreetAsync(int id)
        {
            var street = await _db.Streets.FindAsync(id);
            if (street == null) return false;
            _db.Streets.Remove(street);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<List<Family>> GetFamiliesByStreetAsync(int streetId)
        {
            return await _db.Families.Where(f => f.StreetId == streetId).ToListAsync();
        }

        public async Task<Family> AddFamilyAsync(int streetId, Family family)
        {
            family.StreetId = streetId;
            _db.Families.Add(family);
            await _db.SaveChangesAsync();
            return family;
        }

        public async Task<Family?> UpdateFamilyAsync(int id, Family family)
        {
            var existing = await _db.Families.FindAsync(id);
            if (existing == null) return null;
            existing.FamilyHeadName = family.FamilyHeadName;
            existing.HouseNumber = family.HouseNumber;
            existing.Address = family.Address;
            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteFamilyAsync(int id)
        {
            var family = await _db.Families.FindAsync(id);
            if (family == null) return false;
            _db.Families.Remove(family);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<List<Person>> GetPeopleByFamilyAsync(int familyId)
        {
            return await _db.People.Where(p => p.FamilyId == familyId).ToListAsync();
        }

        public async Task<Person> AddPersonAsync(int familyId, Person person)
        {
            person.FamilyId = familyId;
            _db.People.Add(person);
            await _db.SaveChangesAsync();
            return person;
        }

        public async Task<Person?> UpdatePersonAsync(int id, Person person)
        {
            var existing = await _db.People.FindAsync(id);
            if (existing == null) return null;
            existing.Name = person.Name;
            existing.Gender = person.Gender;
            existing.DateOfBirth = person.DateOfBirth;
            existing.Age = person.Age;
            existing.MobileNumber = person.MobileNumber;
            existing.Occupation = person.Occupation;
            existing.Education = person.Education;
            existing.MaritalStatus = person.MaritalStatus;
            existing.Caste = person.Caste;
            existing.AadhaarNumber = person.AadhaarNumber;
            existing.VoterId = person.VoterId;
            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeletePersonAsync(int id)
        {
            var person = await _db.People.FindAsync(id);
            if (person == null) return false;
            _db.People.Remove(person);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdatePersonPhotoAsync(int id, string photoPath)
        {
            var person = await _db.People.FindAsync(id);
            if (person == null) return false;
            person.PhotoPath = photoPath;
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<object> SearchPeopleAsync(string? query, string? occupation, int? minAge, int? maxAge)
        {
            var q = _db.People.Include(p => p.Family).ThenInclude(f => f.Street).AsQueryable();

            if (!string.IsNullOrEmpty(query))
            {
                q = q.Where(p => EF.Functions.Like(p.Name, $"%{query}%") || (p.AadhaarNumber != null && p.AadhaarNumber.Contains(query)));
            }
            if (!string.IsNullOrEmpty(occupation))
            {
                q = q.Where(p => p.Occupation == occupation);
            }
            if (minAge.HasValue)
            {
                q = q.Where(p => p.Age >= minAge.Value);
            }
            if (maxAge.HasValue)
            {
                q = q.Where(p => p.Age <= maxAge.Value);
            }

            return await q.Select(p => new
            {
                p.Id,
                p.Name,
                p.Age,
                p.Gender,
                p.Occupation,
                p.Education,
                p.Caste,
                p.MaritalStatus,
                p.VoterId,
                p.MobileNumber,
                p.AadhaarNumber,
                p.PhotoPath,
                FamilyHeadName = p.Family != null ? p.Family.FamilyHeadName : "N/A",
                StreetName = p.Family != null && p.Family.Street != null ? p.Family.Street.Name : "N/A"
            }).ToListAsync();
        }
    }
}
