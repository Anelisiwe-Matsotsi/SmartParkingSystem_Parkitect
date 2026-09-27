// This default .ino file will contain logic for the Parking sensors, controlling the two ultrasonic sensors, together with their RGB LEDs, and the brains of the operation (Firebeetle 2 ESP32 C6)

// This is our pin setup. We are using the DFRobot Firebeetle 2 ESP32-C6 board on port 7 to flash the esp
#include <Arduino.h>

const int TRIG_PIN = 5;  // using pin 5 because pin 4 was found faulty on esp (didnt send trigger correctly unless I held it securely with my finger - cracked solder)
const int ECHO_PIN = 7;

void setup() {
  Serial.begin(115200); // Initializes serial communication at 115200 bits per second

  // Configures the specified pins to act either as an input or an output (Arduino, 2023c)
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  
  delay(1000); 
  Serial.println("Starting Distance Test...");

}

void loop() {
  // This fires the trigger
  digitalWrite(TRIG_PIN, LOW); // Clears the trigger pin by setting the voltage to LOW (Arduino, 2023b)
  delayMicroseconds(2); // Pauses the program for the amount of time (in microseconds) specified (Arduino, 2023a)

  // Fires the pulse by setting the pin to HIGH for 20 microseconds (Arduino, 2023b)
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(20);

  digitalWrite(TRIG_PIN, LOW);

  // Reads the pulse on a pin and returns the length of the pulse in microseconds (Arduino, 2023d)
  // The 30000 parameter is the timeout to prevent the board from freezing if no echo returns
  long duration = pulseIn(ECHO_PIN, HIGH, 30000);

  // Math logic for calculating distance:
  // Calculates speed of sound which is ~343 m/s (0.034 cm/us)
  int distance = duration * 0.034 / 2; // we divide by 2 because the sound wave travels to the object and back (Random Nerd Tutorials, 2019).
  
  Serial.print("RESULT: ");
  Serial.print(distance);
  Serial.println(" cm");
  
  delay(250);

}

/* REFERENCES:

 * Arduino, 2023a. delayMicroseconds() (Version 2.0) [Source Code] Available at: < https://www.arduino.cc/reference/en/language/functions/time/delaymicroseconds/ > [Accessed 16 August 2026]
 * Arduino, 2023b. digitalWrite() (Version 2.0) [Source Code] Available at: < https://www.arduino.cc/reference/en/language/functions/digital-io/digitalwrite/ > [Accessed 16 August 2026]
 * Arduino, 2023c. pinMode() (Version 2.0) [Source Code] Available at: < https://www.arduino.cc/reference/en/language/functions/digital-io/pinmode/ > [Accessed 16 August 2026]
 * Arduino, 2023d. pulseIn() (Version 2.0) [Source Code] Available at: < https://www.arduino.cc/reference/en/language/functions/advanced-io/pulsein/ > [Accessed 16 August 2026]
 * Random Nerd Tutorials, 2019. Complete Guide for Ultrasonic Sensor HC-SR04 with Arduino. [online] Available at: < https://randomnerdtutorials.com/complete-guide-for-ultrasonic-sensor-hc-sr04/ > [Accessed 18 August 2026]

*/
