
namespace backend2.Models
{
    //  Map summary DTO (Microsoft, 2026)
    public class ParkingMapResponseDto
    {
        public int TotalBays { get; set; }
        public int AvailableBays { get; set; }
        public int OccupiedBays { get; set; }
        public List<SectionMapDto> Sections { get; set; } = new();
    }

    public class SectionMapDto
    {
        public int SectionID { get; set; }
        public string SectionName { get; set; } = string.Empty;
        public int TotalBays { get; set; }
        public int AvailableBays { get; set; }
        public List<BayMapDto> Bays { get; set; } = new();
    }

    public class BayMapDto
    {
        public int BayID { get; set; }
        public string BayNumber { get; set; } = string.Empty;
        public bool IsOccupied { get; set; }
        public bool HasPhysicalSensor { get; set; }
        public int? DistanceReadingCm { get; set; }
    }

    // (IETF, 2014) IoT Hardware Payload DTO
    public class SensorIngestDto
    {
        public int SensorID { get; set; }
        public int DistanceReadingCm { get; set; }

        public bool? IsOccupied { get; set; }
    }


    public class BeaconBayDto
    {
        public string NodeKey { get; set; } = string.Empty;
        public int BayID { get; set; }
        public string BayNumber { get; set; } = string.Empty;
        public string SectionName { get; set; } = string.Empty;
        public bool IsOccupied { get; set; }
    }

    public class ParkVehicleDto
    {
        public string FirebaseUid { get; set; } = string.Empty;
        public int BayID { get; set; }
    }

public class BayDetailsDto
    {
        public int BayID { get; set; }
        public string BayNumber { get; set; } = string.Empty;
        public string SectionName { get; set; } = string.Empty;
        public bool IsOccupied { get; set; }
        public bool HasPhysicalSensor { get; set; }
        public int? DistanceReadingCm { get; set; }
        public string? OccupantName { get; set; }
        public string? OccupantNumber { get; set; }
        public DateTime? ParkedSince { get; set; }
    }
}

/*
 * References
 * IETF, 2014. RESTful API Design Specification - RFC 7231. [online] Available at: < https://datatracker.ietf.org/doc/html/rfc7231 > [Accessed 06 September 2026]
 * Microsoft, 2026. Create Data Transfer Objects (DTOs) in ASP.NET Core. [online] Available at: < https://learn.microsoft.com/en-us/aspnet/core/web-api/ > [Accessed 06 September 2026]
 */