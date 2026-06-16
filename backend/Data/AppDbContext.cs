using Microsoft.EntityFrameworkCore;
using PanchayatApp.Models;

namespace PanchayatApp.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<GovernmentOfficial> GovernmentOfficials { get; set; } = null!;
        public DbSet<Street> Streets { get; set; } = null!;
        public DbSet<Family> Families { get; set; } = null!;
        public DbSet<Person> People { get; set; } = null!;
        public DbSet<VillageOfficial> VillageOfficials { get; set; } = null!;
        public DbSet<VillageEmployee> VillageEmployees { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Family>()
                .HasOne(f => f.Street)
                .WithMany(s => s.Families)
                .HasForeignKey(f => f.StreetId);

            modelBuilder.Entity<Person>()
                .HasOne(p => p.Family)
                .WithMany(f => f.People)
                .HasForeignKey(p => p.FamilyId);
        }
    }
}
