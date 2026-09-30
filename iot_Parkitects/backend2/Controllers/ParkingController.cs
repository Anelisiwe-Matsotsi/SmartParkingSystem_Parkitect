// [Ref: 1]
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend2.Data;
using backend2.Models;

namespace backend2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParkingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ParkingController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Parking/map
        [HttpGet("map")]
        public async Task<ActionResult<ParkingMapResponseDto>> GetParkingMap()
        {
            // Seed base parking lot data if database is uninitialized
            await EnsureDatabaseSeededAsync();

            var sections = await _context.ParkingSections
                .Include(s => s.ParkingBays)
                    .ThenInclude(b => b.Sensor)
                .OrderBy(s => s.sectionName)
                .ToListAsync();

            var response = new ParkingMapResponseDto();

            foreach (var sec in sections)
            {
                var sectionDto = new SectionMapDto
                {
                    SectionID = sec.sectionID,
                    SectionName = sec.sectionName,
                    TotalBays = sec.ParkingBays.Count,
                    AvailableBays = sec.ParkingBays.Count(b => !b.isOccupied),
                    Bays = sec.ParkingBays
                        .OrderBy(b => b.bayID)
                        .Select(b => new BayMapDto
                        {
                            BayID = b.bayID,
                            BayNumber = b.bayNumber,
                            IsOccupied = b.isOccupied,
                            HasPhysicalSensor = b.Sensor != null,
                            DistanceReadingCm = b.Sensor?.distanceReadingCm
                        }).ToList()
                };

                response.Sections.Add(sectionDto);
            }

            response.TotalBays = response.Sections.Sum(s => s.TotalBays);
            response.AvailableBays = response.Sections.Sum(s => s.AvailableBays);
            response.OccupiedBays = response.TotalBays - response.AvailableBays;

            return Ok(response);
        }

        //  POST: api/Parking/sensor/telemetry
        [HttpPost("sensor/telemetry")]
        public async Task<IActionResult> UpdateSensorTelemetry([FromBody] SensorIngestDto dto)
        {
            var sensor = await _context.Sensors
                .Include(s => s.ParkingBay)
                .FirstOrDefaultAsync(s => s.sensorID == dto.SensorID);

            if (sensor == null)
            {
                return NotFound($"Sensor {dto.SensorID} not found.");
            }

            sensor.distanceReadingCm = dto.DistanceReadingCm;

            // Standard ultrasonic threshold: vehicle present within 50 cm
            if (sensor.ParkingBay != null)
            {
                sensor.ParkingBay.isOccupied = dto.DistanceReadingCm > 0 && dto.DistanceReadingCm <= 50;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Sensor telemetry updated successfully.", isOccupied = sensor.ParkingBay?.isOccupied });
        }

        // Idempotent generator for the 350-bay facility
        private async Task EnsureDatabaseSeededAsync()
        {
            if (await _context.ParkingLots.AnyAsync())
            {
                return;
            }

            var lot = new ParkingLot
            {
                lotName = "Main Campus Lot",
                campusLocation = "North Sector",
                totalCapacity = 350
            };
            _context.ParkingLots.Add(lot);
            await _context.SaveChangesAsync();

            string[] sectionLabels = { "A", "B", "C", "D", "E" };
            var random = new Random(42); // Deterministic seed for reproducible testing

            foreach (var label in sectionLabels)
            {
                var section = new ParkingSection
                {
                    parkingID = lot.parkingID,
                    sectionName = $"Section {label}"
                };
                _context.ParkingSections.Add(section);
                await _context.SaveChangesAsync();

                var bays = new List<ParkingBay>();
                for (int i = 1; i <= 70; i++)
                {
                    bool isBayOccupied = random.Next(0, 2) == 1;

                    // Physical sensors are assigned to Bay A1 and A2
                    if (label == "A" && (i == 1 || i == 2))
                    {
                        isBayOccupied = (i == 2);
                    }

                    bays.Add(new ParkingBay
                    {
                        sectionID = section.sectionID,
                        bayNumber = $"{label}{i}",
                        isOccupied = isBayOccupied
                    });
                }

                _context.ParkingBays.AddRange(bays);
                await _context.SaveChangesAsync();

                // Attach physical hardware nodes to Section A
                if (label == "A")
                {
                    var bay1 = bays.First(b => b.bayNumber == "A1");
                    var bay2 = bays.First(b => b.bayNumber == "A2");

                    _context.Sensors.AddRange(
                      new Sensor
                      {
                          bayID = bay1.bayID,
                          hardwareModel = "ESP32-HC-SR04-Node1",
                          distanceReadingCm = 150,
                          beaconNodeKey = "Node_01"
                      },
new Sensor
{
    bayID = bay2.bayID,
    hardwareModel = "ESP32-HC-SR04-Node2",
    distanceReadingCm = 25,
    beaconNodeKey = "Node_02"
}
                    );
                    await _context.SaveChangesAsync();
                }
            }
        }

        // GET: api/Parking/beacon/Node_01
        [HttpGet("beacon/{nodeKey}")]
        public async Task<IActionResult> GetBayFromBeacon(string nodeKey)
        {
             Console.WriteLine($"[Beacon] lookup for '{nodeKey}'");
            var sensor = await _context.Sensors
                .Include(s => s.ParkingBay)
                .ThenInclude(b => b!.ParkingSection)
                .FirstOrDefaultAsync(s => s.beaconNodeKey == nodeKey);

            if (sensor == null || sensor.ParkingBay == null)
            {
                return NotFound("No parking bay is linked to this beacon.");
            }

            return Ok(new BeaconBayDto
            {
                NodeKey = sensor.beaconNodeKey!,
                BayID = sensor.ParkingBay.bayID,
                BayNumber = sensor.ParkingBay.bayNumber,
                SectionName = sensor.ParkingBay.ParkingSection?.sectionName ?? "",
                IsOccupied = sensor.ParkingBay.isOccupied
            });
            
        }

        // POST: api/Parking/park
        [HttpPost("park")]
        public async Task<IActionResult> ParkVehicle([FromBody] ParkVehicleDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.FirebaseUid == dto.FirebaseUid);

            if (user == null)
            {
                return NotFound("User was not found.");
            }

            var bay = await _context.ParkingBays
                .FirstOrDefaultAsync(b => b.bayID == dto.BayID);

            if (bay == null)
            {
                return NotFound("Parking bay was not found.");
            }

            if (bay.isOccupied)
            {
                return Conflict("This parking bay is already occupied.");
            }

            // Prevent the same user from having multiple active parking sessions
            var existingSession = await _context.ParkingSessions
                .FirstOrDefaultAsync(s =>
                    s.userID == user.UserId &&
                    s.endDate == null);

            if (existingSession != null)
            {
                return Conflict("You already have an active parking session.");
            }

            var session = new ParkingSession
            {
                userID = user.UserId,
                bayID = bay.bayID,
                startDate = DateTime.UtcNow
            };

            bay.isOccupied = true;
            user.IsParked = true;

            _context.ParkingSessions.Add(session);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Parking session started successfully.",
                bayID = bay.bayID,
                bayNumber = bay.bayNumber,
                sessionID = session.sessionID,
                startDate = session.startDate
            });
        }
    }



}

