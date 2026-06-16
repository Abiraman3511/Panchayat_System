using System.Text.Json.Serialization;

namespace PanchayatApp.Models
{
    public class Street
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        [JsonIgnore]
        public ICollection<Family> Families { get; set; } = new List<Family>();
    }

    public class Family
    {
        public int Id { get; set; }
        public int StreetId { get; set; }
        public string FamilyHeadName { get; set; } = string.Empty;
        public string HouseNumber { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;

        [JsonIgnore]
        public Street? Street { get; set; }

        [JsonIgnore]
        public ICollection<Person> People { get; set; } = new List<Person>();
    }

    public class Person
    {
        public int Id { get; set; }
        public int FamilyId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public int Age { get; set; }
        public string MobileNumber { get; set; } = string.Empty;
        public string Occupation { get; set; } = string.Empty;
        public string Education { get; set; } = string.Empty;
        public string MaritalStatus { get; set; } = string.Empty;
        public string Caste { get; set; } = string.Empty;

        // Admin Only Fields
        public string? AadhaarNumber { get; set; }
        public string? VoterId { get; set; }
        public string? PhotoPath { get; set; }

        // Addresses
        public string? PermanentAddress { get; set; }
        public string? PresentAddress { get; set; }

        [JsonIgnore]
        public Family? Family { get; set; }
    }
}
