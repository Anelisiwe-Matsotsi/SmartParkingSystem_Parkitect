using System.ComponentModel.DataAnnotations;

namespace backend2.Models
{

    public class Ticket
    {
        [Key]
        public int ticketId { get; set; }
        public int userId { get; set; }

        [Required]
        public string bayId { get; set; }

        [Required]
        public string bayNumber { get; set; }

        [Required]
        public string sectionId { get; set; }

        [Required]
        public string reason { get; set; }

        public string? description { get; set; } // question mark because it is optional

        public string? imageURL { get; set; }
        public string status { get; set; } = "Pending"; //Default it will be pending


        [DataType(DataType.Date)]
        public DateTime createdAt { get; set; }

        [DataType(DataType.Date)] //This forces the data type to be a date 
        public DateTime? updatedAt { get; set; }

        public string? response { get; set; }

    }
}

