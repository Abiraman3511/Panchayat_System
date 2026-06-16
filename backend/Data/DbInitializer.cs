using PanchayatApp.Models;

namespace PanchayatApp.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext appDb)
        {
            try
            {
                appDb.Database.EnsureCreated();

                // Seed Admins
                if (!appDb.Users.Any(u => u.IsAdmin))
                {
                    appDb.Users.AddRange(
                        new User { Username = "admin1", HashedPassword = BCrypt.Net.BCrypt.HashPassword("admin123"), IsAdmin = true },
                        new User { Username = "admin2", HashedPassword = BCrypt.Net.BCrypt.HashPassword("admin123"), IsAdmin = true }
                    );
                    appDb.SaveChanges();
                    Console.WriteLine("✓ Admin users seeded successfully.");
                }

                // Seed Default User
                if (!appDb.Users.Any(u => u.Username == "user1"))
                {
                    appDb.Users.Add(
                        new User { Username = "user1", HashedPassword = BCrypt.Net.BCrypt.HashPassword("user123"), IsAdmin = false }
                    );
                    appDb.SaveChanges();
                    Console.WriteLine("✓ Default user (user1) seeded successfully.");
                }

                // Seed Village Officials
                if (!appDb.VillageOfficials.Any())
                {
                    appDb.VillageOfficials.AddRange(
                        new VillageOfficial { Name = "Rajesh Kumar", Position = "President", MobileNumber = "9876543210", Address = "12 Main St", PhotoPath = "/default-avatar.png", StartDate = new DateTime(2025, 1, 1), EndDate = new DateTime(2030, 1, 1) },
                        new VillageOfficial { Name = "Anita Sharma", Position = "Vice President", MobileNumber = "9876543211", Address = "45 Market Rd", PhotoPath = "/default-avatar.png", StartDate = new DateTime(2025, 1, 1), EndDate = new DateTime(2030, 1, 1) },
                        new VillageOfficial { Name = "Suresh Patel", Position = "Village Secretary", MobileNumber = "9876543212", Address = "Panchayat Office", PhotoPath = "/default-avatar.png", StartDate = new DateTime(2023, 5, 1), EndDate = new DateTime(2028, 5, 1) },
                        new VillageOfficial { Name = "Vikram Singh", Position = "Ward Member", MobileNumber = "9876543213", Address = "8 Temple Ln", PhotoPath = "/default-avatar.png", StartDate = new DateTime(2025, 1, 1), EndDate = new DateTime(2030, 1, 1) },
                        new VillageOfficial { Name = "Meena Devi", Position = "Ward Member", MobileNumber = "9876543214", Address = "22 River Rd", PhotoPath = "/default-avatar.png", StartDate = new DateTime(2025, 1, 1), EndDate = new DateTime(2030, 1, 1) },
                        new VillageOfficial { Name = "Ramesh Gupta", Position = "Ward Member", MobileNumber = "9876543215", Address = "15 North St", PhotoPath = "/default-avatar.png", StartDate = new DateTime(2025, 1, 1), EndDate = new DateTime(2030, 1, 1) },
                        new VillageOfficial { Name = "Sunita Reddy", Position = "Ward Member", MobileNumber = "9876543216", Address = "3 West End", PhotoPath = "/default-avatar.png", StartDate = new DateTime(2025, 1, 1), EndDate = new DateTime(2030, 1, 1) },
                        new VillageOfficial { Name = "Arjun Das", Position = "Ward Member", MobileNumber = "9876543217", Address = "10 East Blvd", PhotoPath = "/default-avatar.png", StartDate = new DateTime(2025, 1, 1), EndDate = new DateTime(2030, 1, 1) },
                        new VillageOfficial { Name = "Kavita Iyer", Position = "Ward Member", MobileNumber = "9876543218", Address = "5 South Ln", PhotoPath = "/default-avatar.png", StartDate = new DateTime(2025, 1, 1), EndDate = new DateTime(2030, 1, 1) },
                        new VillageOfficial { Name = "Manoj Tiwari", Position = "Ward Member", MobileNumber = "9876543219", Address = "9 Central Ave", PhotoPath = "/default-avatar.png", StartDate = new DateTime(2025, 1, 1), EndDate = new DateTime(2030, 1, 1) },
                        new VillageOfficial { Name = "Pooja Singh", Position = "Ward Member", MobileNumber = "9876543220", Address = "18 Park St", PhotoPath = "/default-avatar.png", StartDate = new DateTime(2025, 1, 1), EndDate = new DateTime(2030, 1, 1) },
                        new VillageOfficial { Name = "Rahul Verma", Position = "Ward Member", MobileNumber = "9876543221", Address = "2 Lake View", PhotoPath = "/default-avatar.png", StartDate = new DateTime(2025, 1, 1), EndDate = new DateTime(2030, 1, 1) }
                    );
                    appDb.SaveChanges();
                    Console.WriteLine("✓ Village Officials seeded.");
                }

                // Seed Village Employees
                if (!appDb.VillageEmployees.Any())
                {
                    appDb.VillageEmployees.AddRange(
                        new VillageEmployee { Name = "Ashok Kumar", Designation = "Electrician", MobileNumber = "9876543310", Address = "10 Power St", PhotoPath = "/default-avatar.png" },
                        new VillageEmployee { Name = "Ravi Teja", Designation = "Water operator", MobileNumber = "9876543311", Address = "5 Pump Rd", PhotoPath = "/default-avatar.png" },
                        new VillageEmployee { Name = "Kishore Babu", Designation = "Water operator", MobileNumber = "9876543312", Address = "1 Water Tank", PhotoPath = "/default-avatar.png" },
                        new VillageEmployee { Name = "Naresh", Designation = "Water operator", MobileNumber = "9876543313", Address = "4 Canal Rd", PhotoPath = "/default-avatar.png" },
                        new VillageEmployee { Name = "Lakshmi Bai", Designation = "Sanitary Worker", MobileNumber = "9876543314", Address = "12 Clean Ln", PhotoPath = "/default-avatar.png" },
                        new VillageEmployee { Name = "Saraswati", Designation = "Sanitary Worker", MobileNumber = "9876543315", Address = "14 Clean Ln", PhotoPath = "/default-avatar.png" },
                        new VillageEmployee { Name = "Gowri", Designation = "Sanitary Worker", MobileNumber = "9876543316", Address = "16 Clean Ln", PhotoPath = "/default-avatar.png" },
                        new VillageEmployee { Name = "Ramulamma", Designation = "Sanitary Worker", MobileNumber = "9876543317", Address = "18 Clean Ln", PhotoPath = "/default-avatar.png" },
                        new VillageEmployee { Name = "Venkayamma", Designation = "Sanitary Worker", MobileNumber = "9876543318", Address = "20 Clean Ln", PhotoPath = "/default-avatar.png" },
                        new VillageEmployee { Name = "Ganesh Babu", Designation = "Village Assistant", MobileNumber = "9876543319", Address = "Office Building", PhotoPath = "/default-avatar.png" }
                    );
                    appDb.SaveChanges();
                    Console.WriteLine("✓ Village Employees seeded.");
                }

                // Seed Government Officials
                if (!appDb.GovernmentOfficials.Any())
                {
                    appDb.GovernmentOfficials.AddRange(
                        new GovernmentOfficial { Name = "Dr. K. Karthikeyan IAS", Position = "District Collector", PhotoPath = "/default-avatar.png" },
                        new GovernmentOfficial { Name = "R. Meenakshi", Position = "District Revenue Officer", PhotoPath = "/default-avatar.png" },
                        new GovernmentOfficial { Name = "S. Venkataraman", Position = "Revenue Divisional Officer", PhotoPath = "/default-avatar.png" },
                        new GovernmentOfficial { Name = "M. Lakshmi", Position = "Tahsildar", PhotoPath = "/default-avatar.png" },
                        new GovernmentOfficial { Name = "V. Balaji", Position = "Deputy Tahsildar", PhotoPath = "/default-avatar.png" },
                        new GovernmentOfficial { Name = "P. Selvam", Position = "Revenue Inspector", PhotoPath = "/default-avatar.png" },
                        new GovernmentOfficial { Name = "A. Murugan", Position = "Village Administrative Officer (VAO)", PhotoPath = "/default-avatar.png" }
                    );
                    appDb.SaveChanges();
                    Console.WriteLine("✓ Government Officials seeded.");
                }

                // Seed People Directory
                if (!appDb.Streets.Any())
                {
                    var street1 = new Street { Name = "Main Street" };
                    var street2 = new Street { Name = "Gandhi Road" };
                    var street3 = new Street { Name = "Temple Lane" };
                    var street4 = new Street { Name = "Market Square" };
                    var street5 = new Street { Name = "Riverside Path" };

                    appDb.Streets.AddRange(street1, street2, street3, street4, street5);
                    appDb.SaveChanges();

                    var family1 = new Family { StreetId = street1.Id, FamilyHeadName = "Ramesh Kumar", HouseNumber = "12A", Address = "12A Main Street, Village" };
                    var family2 = new Family { StreetId = street1.Id, FamilyHeadName = "Sita Devi", HouseNumber = "14B", Address = "14B Main Street, Village" };
                    var family3 = new Family { StreetId = street2.Id, FamilyHeadName = "Arjun Singh", HouseNumber = "5", Address = "5 Gandhi Road, Village" };
                    var family4 = new Family { StreetId = street3.Id, FamilyHeadName = "Mohammed Ali", HouseNumber = "8", Address = "8 Temple Lane, Village" };
                    var family5 = new Family { StreetId = street4.Id, FamilyHeadName = "Priya Sharma", HouseNumber = "22", Address = "22 Market Square, Village" };
                    var family6 = new Family { StreetId = street5.Id, FamilyHeadName = "David John", HouseNumber = "1A", Address = "1A Riverside Path, Village" };
                    
                    appDb.Families.AddRange(family1, family2, family3, family4, family5, family6);
                    appDb.SaveChanges();

                    appDb.People.AddRange(
                        // Family 1
                        new Person { FamilyId = family1.Id, Name = "Ramesh Kumar", Gender = "Male", DateOfBirth = new DateTime(1980, 5, 12), Age = 45, MobileNumber = "9876543210", Occupation = "Farmer", Education = "10th Grade", MaritalStatus = "Married", Caste = "OBC", AadhaarNumber = "1234-5678-9012", VoterId = "ABC1234567" },
                        new Person { FamilyId = family1.Id, Name = "Lakshmi Kumar", Gender = "Female", DateOfBirth = new DateTime(1982, 8, 20), Age = 43, MobileNumber = "9876543211", Occupation = "Homemaker", Education = "8th Grade", MaritalStatus = "Married", Caste = "OBC", AadhaarNumber = "1234-5678-9013", VoterId = "ABC1234568" },
                        new Person { FamilyId = family1.Id, Name = "Rahul Kumar", Gender = "Male", DateOfBirth = new DateTime(2005, 1, 15), Age = 21, MobileNumber = "9876543212", Occupation = "Student", Education = "B.Sc", MaritalStatus = "Single", Caste = "OBC", AadhaarNumber = "1234-5678-9014", VoterId = "ABC1234569" },
                        
                        // Family 2
                        new Person { FamilyId = family2.Id, Name = "Sita Devi", Gender = "Female", DateOfBirth = new DateTime(1975, 3, 10), Age = 51, MobileNumber = "9876543213", Occupation = "Tailor", Education = "12th Grade", MaritalStatus = "Widowed", Caste = "SC", AadhaarNumber = "1234-5678-9015", VoterId = "ABC1234570" },
                        new Person { FamilyId = family2.Id, Name = "Kavya", Gender = "Female", DateOfBirth = new DateTime(2002, 11, 22), Age = 23, MobileNumber = "9876543214", Occupation = "Teacher", Education = "B.Ed", MaritalStatus = "Single", Caste = "SC", AadhaarNumber = "1234-5678-9016", VoterId = "ABC1234571" },
                        
                        // Family 3
                        new Person { FamilyId = family3.Id, Name = "Arjun Singh", Gender = "Male", DateOfBirth = new DateTime(1990, 7, 5), Age = 35, MobileNumber = "9876543215", Occupation = "Shopkeeper", Education = "B.Com", MaritalStatus = "Married", Caste = "General", AadhaarNumber = "1234-5678-9017", VoterId = "ABC1234572" },
                        new Person { FamilyId = family3.Id, Name = "Meera Singh", Gender = "Female", DateOfBirth = new DateTime(1992, 4, 18), Age = 33, MobileNumber = "9876543216", Occupation = "Nurse", Education = "B.Sc Nursing", MaritalStatus = "Married", Caste = "General", AadhaarNumber = "1234-5678-9018", VoterId = "ABC1234573" },
                        
                        // Family 4
                        new Person { FamilyId = family4.Id, Name = "Mohammed Ali", Gender = "Male", DateOfBirth = new DateTime(1968, 9, 12), Age = 57, MobileNumber = "9876543217", Occupation = "Mechanic", Education = "ITI", MaritalStatus = "Married", Caste = "General", AadhaarNumber = "1234-5678-9019", VoterId = "ABC1234574" },
                        new Person { FamilyId = family4.Id, Name = "Zoya Ali", Gender = "Female", DateOfBirth = new DateTime(1972, 2, 28), Age = 53, MobileNumber = "9876543218", Occupation = "Homemaker", Education = "10th Grade", MaritalStatus = "Married", Caste = "General", AadhaarNumber = "1234-5678-9020", VoterId = "ABC1234575" },
                        new Person { FamilyId = family4.Id, Name = "Zain Ali", Gender = "Male", DateOfBirth = new DateTime(1998, 12, 5), Age = 27, MobileNumber = "9876543219", Occupation = "Software Engineer", Education = "B.Tech", MaritalStatus = "Single", Caste = "General", AadhaarNumber = "1234-5678-9021", VoterId = "ABC1234576" },

                        // Family 5
                        new Person { FamilyId = family5.Id, Name = "Priya Sharma", Gender = "Female", DateOfBirth = new DateTime(1985, 6, 30), Age = 40, MobileNumber = "9876543220", Occupation = "Bank Manager", Education = "MBA", MaritalStatus = "Divorced", Caste = "General", AadhaarNumber = "1234-5678-9022", VoterId = "ABC1234577" },
                        new Person { FamilyId = family5.Id, Name = "Aryan Sharma", Gender = "Male", DateOfBirth = new DateTime(2012, 8, 14), Age = 13, MobileNumber = "N/A", Occupation = "Student", Education = "8th Grade", MaritalStatus = "Single", Caste = "General", AadhaarNumber = "1234-5678-9023", VoterId = "N/A" },

                        // Family 6
                        new Person { FamilyId = family6.Id, Name = "David John", Gender = "Male", DateOfBirth = new DateTime(1978, 1, 20), Age = 48, MobileNumber = "9876543221", Occupation = "Electrician", Education = "12th Grade", MaritalStatus = "Married", Caste = "OBC", AadhaarNumber = "1234-5678-9024", VoterId = "ABC1234578" },
                        new Person { FamilyId = family6.Id, Name = "Mary John", Gender = "Female", DateOfBirth = new DateTime(1981, 10, 10), Age = 44, MobileNumber = "9876543222", Occupation = "Cook", Education = "10th Grade", MaritalStatus = "Married", Caste = "OBC", AadhaarNumber = "1234-5678-9025", VoterId = "ABC1234579" }
                    );
                    appDb.SaveChanges();
                    Console.WriteLine("✓ People Directory seeded.");
                }

                Console.WriteLine("✓ Database connected and seeded successfully!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"✗ Database connection failed: {ex.Message}");
            }
        }
    }
}
