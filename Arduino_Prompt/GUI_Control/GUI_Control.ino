#include <Braccio.h>
#include <Servo.h>

Servo base;
Servo shoulder;
Servo elbow;
Servo wrist_rot;
Servo wrist_ver;
Servo gripper;

void setup() {  
  Braccio.begin();
  Serial.begin(115200);  // Initialize serial communication
}

void loop() {
  if (Serial.available() > 0) {
    // Read the incoming command
    String command = Serial.readStringUntil('\n');
    
    // Parse the command to extract m1 to m6 values
    int m1, m2, m3, m4, m5, m6;
    sscanf(command.c_str(), "%d %d %d %d %d %d", &m1, &m2, &m3, &m4, &m5, &m6);
    
    // Set the servo positions
    Braccio.ServoMovement(20, m1, m2, m3, m4, m5, m6);
  }
}