namespace backend2.DTOs
{
    public class AccessibilityDto
    {
        //(Noble, 2024)
        public string textSize { get; set; } = "medium";
        public string theme { get; set; } = "default";
        public bool screenReader { get; set; }
        public bool reduceMotion { get; set; }
        public bool hapticFeedback { get; set; }
    }
}

/*
 * References
 * 
 * Noble, A., 2024. C#, .NET Core Web API with React (TypeScript) Frontend. [online]Available at: < https://github.com/AbrahamNobleOX/React_dotNET_ASP.NETCore > [Accessed 30 August 2026]
 * 
 */