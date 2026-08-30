namespace backend2.Models
{
    public class Accessibility
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        //need to tie this to the authentication code
        public Guid userId { get; set; }

        //(Noble, 2024)
        public string textSize { get; set; } = "medium";
        public string theme { get; set; } = "default";
        public bool reduceMotion { get; set; } = false;
        public bool screenReader { get; set; } = true;
        public bool hapticFeedback { get; set; } = true;

    }

    /*
 * References
 * 
 * Noble, A., 2024. C#, .NET Core Web API with React (TypeScript) Frontend. [online]Available at: < https://github.com/AbrahamNobleOX/React_dotNET_ASP.NETCore > [Accessed 30 August 2026]
 * 
 */
}