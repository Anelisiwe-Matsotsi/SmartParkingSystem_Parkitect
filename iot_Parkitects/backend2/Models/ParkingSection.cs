// Imports for schema mapping (Microsoft, 2026a)
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend2.Models
{
    [Table("ParkingSection")]
    public class ParkingSection
    {
        [Key]
        public int sectionID { get; set; }

        [Required]
        public int parkingID { get; set; }

        [Required]
        [MaxLength(255)]
        public string sectionName { get; set; } = string.Empty;

        // Establishes a foreign key relationship to the ParkingLot model (Microsoft, 2026b)
        [ForeignKey("parkingID")]
        public ParkingLot? ParkingLot { get; set; }

        public ICollection<ParkingBay> ParkingBays { get; set; } = new List<ParkingBay>();
    }
}

/*
 * References
 * Microsoft, 2026a. Data Annotations in EF Core. (Version 10.0) [Source Code] Available at: < https://learn.microsoft.com/en-us/ef/core/modeling/ > [Accessed 08 September 2026]
 * Microsoft, 2026b. Relationships, Navigation Properties and Foreign Keys. (Version 10.0) [Source Code] Available at: < https://learn.microsoft.com/en-us/ef/core/modeling/relationships > [Accessed 08 September 2026]
 */