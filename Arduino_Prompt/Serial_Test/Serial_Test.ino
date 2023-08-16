 /*
  testBraccio90.ino

 testBraccio90 is a setup sketch to check the alignment of all the servo motors
 This is the first sketch you need to run on Braccio
 When you start this sketch Braccio will be positioned perpendicular to the base
 If you can't see the Braccio in this exact position you need to reallign the servo motors position

 Created on 18 Nov 2015
 by Andrea Martino

 This example is in the public domain.
 */

#include <Braccio.h>
#include <Servo.h>


Servo base;
Servo shoulder;
Servo elbow;
Servo wrist_rot;
Servo wrist_ver;
Servo gripper;

void setup() {  
  //Initialization functions and set up the initial position for Braccio
  //All the servo motors will be positioned in the "safety" position:
  //Base (M1):90 degrees
  //Shoulder (M2): 45 degrees
  //Elbow (M3): 180 degrees
  //Wrist vertical (M4): 180 degrees
  //Wrist rotation (M5): 90 degrees
  //gripper (M6): 10 degrees
  
   Serial.begin(9600);
  Braccio.begin();
}

void loop() {
  /*
   Step Delay: a milliseconds delay between the movement of each servo.  Allowed values from 10 to 30 msec.
   M1=base degrees. Allowed values from 0 to 180 degrees
   M2=shoulder degrees. Allowed values from 15 to 165 degrees
   M3=elbow degrees. Allowed values from 0 to 180 degrees
   M4=wrist vertical degrees. Allowed values from 0 to 180 degrees
   M5=wrist rotation degrees. Allowed values from 0 to 180 degrees
   M6=gripper degrees. Allowed values from 10 to 73 degrees. 10: the toungue is open, 73: the gripper is closed.
  */
  
  // the arm is aligned upwards  and the gripper is closed
                     //(step delay, M1, M2, M3, M4, M5, M6);
  Serial.println("Welcome to the Robotic Arm Control Panel");
  Serial.println("Please enter the angles for each motor:");

  int m1 = readInt("Base Motor Angle: ");Serial.println(m1);
  int m2 = readInt("Shoulder Motor Angle: ");Serial.println(m2);
  int m3 = readInt("Elbow Motor Angle: ");Serial.println(m3);
  int m4 = readInt("Vertical Wrist Motor Angle: ");Serial.println(m4);
  int m5 = readInt("Rotatory Wrist Motor Angle: ");Serial.println(m5);
  int m6 = readInt("Gripper Motor Angle: ");Serial.println(m6);

  Serial.println("Thank you for entering the angles.");
  Serial.println("Entered angles:");
  Serial.print("Base Motor: "); Serial.println(m1);
  Serial.print("Shoulder Motor: "); Serial.println(m2);
  Serial.print("Elbow Motor: "); Serial.println(m3);
  Serial.print("Vertical Wrist Motor: "); Serial.println(m4);
  Serial.print("Rotatory Wrist Motor: "); Serial.println(m5);
  Serial.print("Gripper Motor: "); Serial.println(m6);

  delay(1000); // Optional delay before prompting for input again
  Braccio.ServoMovement(20,         m1, m2, m3, m4, m5,  m6);  
	 
}


int readInt(const char* prompt) {
  Serial.print(prompt);
  while (!Serial.available()) {}
  
  int value = 0;
  char currentChar = Serial.read();
  
  // Read characters until a newline is encountered
  while (currentChar != '\n') {
    if (isdigit(currentChar)) {
      value = value * 10 + (currentChar - '0');
    }
    currentChar = Serial.read();
  }
  
  return value;
}
