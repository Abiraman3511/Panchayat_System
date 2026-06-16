namespace PanchayatApp.Models
{
    public class VillageEmployee
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Designation { get; set; }
        public required string MobileNumber { get; set; }
        public required string Address { get; set; }
        public required string PhotoPath { get; set; }
    }
}
