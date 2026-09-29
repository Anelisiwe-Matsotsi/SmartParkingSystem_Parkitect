// This default .ino file will contain logic to control the LCD Display which will display the nujmber of available parkings based off the readings it retrieves from Firebase
// This code will be flashed onto the DevKitV1 ESP32
// It tracks a 350 parking spots where 348 of them are mock spots are permanently occupied
// Realtime parking spot availability depends on the 2 live sensor bays polled from Firebase

#include <Arduino.h>
#include <WiFi.h> // (Espressif Systems, 2023)
#include <LiquidCrystal.h> // (Arduino, 2023b)

// Wifi Credentials
#define WIFI_SSID "HUAWEI-B525-B6DF"
#define WIFI_PASSWORD "0L659M2Y403"

// Initialize the LCD pins (RS, E, D4, D5, D6, D7) (Arduino, 2023b)
LiquidCrystal lcd(22, 23, 5, 18, 19, 21);

// Our parking lot configurations
const int TOTAL_SPOTS = 350;
const int MOCK_OCCUPIED_SPOTS = 348;
unsigned long lastDatabasePoll = 0;

void setup() {
  Serial.begin(115200);

  // LCD Contrast PWM Setup (Universal ESP32 Core compatibility) (Arduino, 2023c)
  pinMode(13, OUTPUT);
  #if defined(ESP_ARDUINO_VERSION_MAJOR) && ESP_ARDUINO_VERSION_MAJOR >= 3
    ledcAttach(13, 1000, 8); // 1 kHz frequency, 8-bit resolution
    ledcWrite(13, 120);
  #else
    ledcSetup(0, 1000, 8); // Channel 0, 1 kHz, 8-bit
    ledcAttachPin(13, 0);
    ledcWrite(0, 120);
  #endif
  
  // RW pin grounded for Write mode (Arduino, 2023a)
  pinMode(4, OUTPUT);
  digitalWrite(4, LOW); 

  // Initializes the screen
  lcd.begin(16, 2);
  lcd.setCursor(0, 0);
  lcd.print("SMART PARKING");
  lcd.setCursor(0, 1);
  lcd.print("Connecting Wifi");

  // Connect to Wi-Fi (Espressif Systems, 2023)
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("\nConnecting to Wifi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }
  
  Serial.println("\nWifi Connected.");
  lcd.setCursor(0, 1);
  lcd.print("Wifi Connected! ");
  
  delay(2000); 
  lcd.clear();

}

void loop() {
  // put your main code here, to run repeatedly:

}

/* REFERENCES:

 * Arduino, 2023a. digitalWrite() (Version 2.0) [Source Code] Available at: < https://www.arduino.cc/reference/en/language/functions/digital-io/digitalwrite/ > [Accessed 29 September 2026]
 * Arduino, 2023b. LiquidCrystal() (Version 1.0.7) [Source Code] Available at: < https://www.arduino.cc/reference/en/libraries/liquidcrystal/ > [Accessed 29 September 2026]
 * Arduino, 2023c. pinMode() (Version 2.0) [Source Code] Available at: < https://www.arduino.cc/reference/en/language/functions/digital-io/pinmode/ > [Accessed 29 September 2026]
 * Espressif Systems, 2023. WiFi Station Example (Version 3.0) [Source Code] Available at: < https://github.com/espressif/arduino-esp32/tree/master/libraries/WiFi > [Accessed 29 September 2026]
 
*/
