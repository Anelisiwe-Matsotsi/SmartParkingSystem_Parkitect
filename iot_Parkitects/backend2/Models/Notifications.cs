using System.ComponentModel.DataAnnotations.Schema;

namespace backend2.Models
{
    public class Notifications
    {
        public int notificationID {get; set;}
        public string notificationType {get; set;} = string.Empty;
        public string title {get; set;} = string.Empty;
        public string description {get; set;} = string.Empty;
        public DateTime time {get; set;}        
    }
}