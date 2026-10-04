// Imports for schema mapping (Microsoft, 2026a)
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend2.Models
{
    // Maps the class to the corresponding SQL table (Microsoft, 2026b)
    [Table("ParkingLot")]
    public class ParkingLot
    {
        [Key]
        public int parkingID { get; set; }

        [Required]
        [MaxLength(255)]
        public string lotName { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string campusLocation { get; set; } = string.Empty;

        [Required]
        public int totalCapacity { get; set; }

        // Acts as a navigation property for relational database mapping (Fowler, 2002)
        public ICollection<ParkingSection> ParkingSections { get; set; } = new List<ParkingSection>();
    }
}

/*
 * References
 * Fowler, M., 2002. Patterns of Enterprise Application Architecture. [online] Available at: < https://martinfowler.com/eaaCatalog/ > [Accessed 08 September 2026]
 * Microsoft, 2026a. System.ComponentModel.DataAnnotations Namespace. (Version 10.0) [Source Code] Available at: < https://learn.microsoft.com/en-us/dotnet/api/system.componentmodel.dataannotations > [Accessed 06 September 2026]
 * Microsoft, 2026b. Entity Framework Core Relational Table Attribute Mapping. (Version 10.0) [Source Code] Available at: < https://learn.microsoft.com/en-us/ef/core/modeling/entity-types > [Accessed 06 September 2026]
 */