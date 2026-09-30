using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend2.Models
{
    [Table("ParkingBay")]
    public class ParkingBay
    {
        [Key] 
        public int bayID { get; set; }

        [Required]
        public int layoutID { get; set; }

        [Required]
        [MaxLength(255)]
        public string bayNumber { get; set; }

        [Required]
        public bool isOccupied { get; set; }
    }
}