using System.ComponentModel.DataAnnotations.Schema;

namespace backend2.Models
{
    public class Notifications
    {
        public int notificationID {get; set;}
        public string notificationType {get; set;}
        public string title {get; set;}
        public string description {get; set;}
        public DateTime time {get; set;}        
    }
}