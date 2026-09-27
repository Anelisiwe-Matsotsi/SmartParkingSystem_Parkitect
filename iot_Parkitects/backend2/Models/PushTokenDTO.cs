using System.ComponentModel.DataAnnotations.Schema;

namespace backend2.Models
{
    public class PushTokenDTO
    {
        public string userID {get; set;} = string.Empty;
        public string token {get; set;} = string.Empty;
        public string platform {get; set;} = string.Empty;   
    }
}