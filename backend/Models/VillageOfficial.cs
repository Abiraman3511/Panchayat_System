using System;
using System.ComponentModel.DataAnnotations;

namespace PanchayatApp.Models
{
    public class VillageOfficial
    {
        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        public string Position { get; set; } = string.Empty;
        
        [Required]
        public string MobileNumber { get; set; } = string.Empty;
        
        [Required]
        public string Address { get; set; } = string.Empty;
        
        public string PhotoPath { get; set; } = string.Empty;
        
        [Required]
        public DateTime StartDate { get; set; }
        
        [Required]
        public DateTime EndDate { get; set; }
    }
}
