using System.ComponentModel.DataAnnotations.Schema;

namespace backend2.Models
{
    public class PushToken
    {
        public int tokenID {get; set;}
        public string userID {get; set;}
        public string token {get; set;}
        public string platform {get; set;}
        public DateTime createdAt {get; set;} = DateTime.UtcNow;
        public DateTime? updatedAt {get; set;}       

    }
}