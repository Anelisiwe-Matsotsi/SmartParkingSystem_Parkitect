// This default .ino file will contain logic for the Parking sensors, controlling the two ultrasonic sensors, together with their RGB LEDs, and the brains of the operation (Firebeetle 2 ESP32 C6)

// This is our pin setup. We are using the DFRobot Firebeetle 2 ESP32-C6 board on port 7 to flash the esp
#include <Arduino.h>

// this is for the first parking sensor + LED
const int TRIG_PIN = 5;  // using pin 5 because pin 4 was found faulty on esp (didnt send trigger correctly unless I held it securely with my finger - cracked solder)
const int ECHO_PIN = 7;
const int RED_PIN = 2;
const int GREEN_PIN = 3;

// this is for the second sensor + LED
const int TRIG_PIN_2 = 6;
const int ECHO_PIN_2 = 8;
const int RED_PIN_2 = 9;
const int GREEN_PIN_2 = 18;

void setup() {
  Serial.begin(115200); // Initializes serial communication at 115200 bits per second

  // Configures the specified pins to act either as an input or an output for Bay 1 (Arduino, 2023c)
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);

  // Configures Bay 2s sensor and LED pins as input or output (Arduino, 2023c)
  pinMode(TRIG_PIN_2, OUTPUT);
  pinMode(ECHO_PIN_2, INPUT);
  pinMode(GREEN_PIN_2, OUTPUT);

  // Turns Bay 1s LEDs OFF initially (anode logic >> HIGH = OFF) (Arduino, 2023b)
  digitalWrite(RED_PIN, HIGH);
  digitalWrite(GREEN_PIN, HIGH);

  // Turns Bay 2s LEDs OFF initially (anode logic >> HIGH = OFF) (Arduino, 2023b)
  digitalWrite(RED_PIN_2, HIGH);
  digitalWrite(GREEN_PIN_2, HIGH);
  
  delay(1000); 
  Serial.println("Starting Distance Test with Bay 2's Sensor added...");

}

// Created this function to trigger, read and display the occupancy status for either of the 2 bays
void processBay(int trigPin, int echoPin, int redPin, int greenPin, String bayName) {
  // Clears and sends a pulse (Arduino, 2023b)
  // This fires the trigger
  digitalWrite(trigPin, LOW); // Clears the trigger pin by setting the voltage to LOW (Arduino, 2023b)
  delayMicroseconds(2); // Pauses the program for the amount of time (in microseconds) specified (Arduino, 2023a)
  // Fires the pulse by setting the pin to HIGH for 20 microseconds (Arduino, 2023b)
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(20);
  digitalWrite(trigPin, LOW);

  // Reads the pulse on a pin and returns the length of the pulse in microseconds (Arduino, 2023d)
  // The 30000 parameter is the timeout to prevent the board from freezing if no echo returns
  long duration = pulseIn(echoPin, HIGH, 30000);

  // Logic for the RGB LEDs to turn green when parking spot is available (specified distance) or red when occupied (passed the specified distance)
  // 0 represents a timeout from the sensors 20cm blind spot, meaning the bay is occupied
  if (duration == 0) 
  {
    Serial.println(bayName + " Status: Occupied");
    // Turns the red light ON (LOW) and green OFF (HIGH) (Arduino, 2023b)
    digitalWrite(redPin, LOW);
    digitalWrite(greenPin, HIGH);
  } 
  else 
  {
    // Math logic for calculating distance:
    // Calculates speed of sound which is ~343 m/s (0.034 cm/us)
    int distance = duration * 0.034 / 2; // we divide by 2 because the sound wave travels to the object and back (Random Nerd Tutorials, 2019).
    
    Serial.print(bayName + " Distance: ");
    Serial.print(distance);
    Serial.println(" cm");

    // Checks the bays occupancy based on the distance threshold (60cm)
    if (distance > 60) // empty bay
    {
      // Turns the green light ON (LOW) and RED OFF (HIGH) (Arduino, 2023b)
      digitalWrite(greenPin, LOW);
      digitalWrite(redPin, HIGH);
    } 
    else // occupied
    {
      // Turns red ON (LOW) and GREEN OFF (HIGH) (Arduino, 2023b)
      digitalWrite(redPin, LOW);
      digitalWrite(greenPin, HIGH);
    }
  }
}

void loop() {
  // Runs the scan for Bay 1
  processBay(TRIG_PIN_1, ECHO_PIN_1, RED_PIN_1, GREEN_PIN_1, "BAY 1");
  
  // 50ms time allows the physical ultrasonic reflections to clear before triggering the next sensor
  delay(50);
  
  // Runs rhe scan for Bay 2
  processBay(TRIG_PIN_2, ECHO_PIN_2, RED_PIN_2, GREEN_PIN_2, "BAY 2");
  
  Serial.println("-------------------------");
  
  delay(250);

}

/* REFERENCES:

 * Arduino, 2023a. delayMicroseconds() (Version 2.0) [Source Code] Available at: < https://www.arduino.cc/reference/en/language/functions/time/delaymicroseconds/ > [Accessed 16 August 2026]
 * Arduino, 2023b. digitalWrite() (Version 2.0) [Source Code] Available at: < https://www.arduino.cc/reference/en/language/functions/digital-io/digitalwrite/ > [Accessed 16 August 2026]
 * Arduino, 2023c. pinMode() (Version 2.0) [Source Code] Available at: < https://www.arduino.cc/reference/en/language/functions/digital-io/pinmode/ > [Accessed 16 August 2026]
 * Arduino, 2023d. pulseIn() (Version 2.0) [Source Code] Available at: < https://www.arduino.cc/reference/en/language/functions/advanced-io/pulsein/ > [Accessed 16 August 2026]
 * Random Nerd Tutorials, 2019. Complete Guide for Ultrasonic Sensor HC-SR04 with Arduino. [online] Available at: < https://randomnerdtutorials.com/complete-guide-for-ultrasonic-sensor-hc-sr04/ > [Accessed 18 August 2026]

*/
