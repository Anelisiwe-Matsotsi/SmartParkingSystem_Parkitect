using System.ComponentModel.DataAnnotations.Schema;

namespace backend2.Models
{
    public class PushTokenDTO
    {
        public string userID {get; set;}
        public string token {get; set;}
        public string platform {get; set;}       
    }
}