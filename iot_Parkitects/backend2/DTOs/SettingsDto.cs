namespace backend2.DTOs
{
    public class SettingsDto
    {
        //(Noble, 2024)
        public string language { get; set; } = "English";
        public string? location { get; set; }
        public bool emailNotifications { get; set; }
        public bool pushNotifications { get; set; }

    }
}

/*
 * References
 * 
 * Noble, A., 2024. C#, .NET Core Web API with React (TypeScript) Frontend. [online]Available at: < https://github.com/AbrahamNobleOX/React_dotNET_ASP.NETCore > [Accessed 30 August 2026]
 * 
 */