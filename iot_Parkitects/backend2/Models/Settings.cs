namespace backend2.Models
{
    public class Settings
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        //need to tie this to the authentication code
        public Guid userId { get; set; }

        //(Noble, 2024)
        public string language { get; set; } = "English";
        public string? location { get; set; }
        public bool emailNotifications { get; set; } = false;
        public bool pushNotifications { get; set; } = true;

    }
}

/*
 * References
 * 
 * Noble, A., 2024. C#, .NET Core Web API with React (TypeScript) Frontend. [online]Available at: < https://github.com/AbrahamNobleOX/React_dotNET_ASP.NETCore > [Accessed 30 August 2026]
 * 
 */