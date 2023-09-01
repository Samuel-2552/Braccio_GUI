#include <Braccio.h>
#include <Servo.h>
#include <InverseK.h>
#include <Pixy2.h>
// pixy.ccc.blocks::write function is customly created
// only runnable in sunil device

String incomingByte;
Servo base;
Servo shoulder;
Servo elbow;
Servo wrist_rot;
Servo wrist_ver;
Servo gripper;

Pixy2 pixy;

void setup()
{
    Link base, upperarm, forearm, hand;

    base.init(0, b2a(0.0), b2a(180.0));
    upperarm.init(200, b2a(15.0), b2a(165.0));
    forearm.init(200, b2a(0.0), b2a(180.0));
    hand.init(270, b2a(0.0), b2a(180.0));

    // Attach the links to the inverse kinematic model
    InverseK.attach(base, upperarm, forearm, hand);

    Serial.begin(115200);

    // Braccio
    Braccio.begin();

    pixy.init();
}

void loop()
{

    if (Serial.available() > 0)
    {

        incomingByte = Serial.readStringUntil('\n');

        // check whether it contains P
        // split at comma
        // set values for joints

        String joint_string = "P";
        String world_string = "W";
        String image_string = "I";

        // check if there is a substring
        // handles serial robot input
        // motor joint angels
        if (strstr(incomingByte.c_str(), joint_string.c_str()))
        {
            int params[7];

            // remove first character 'P'
            String cleanString = incomingByte.substring(1, incomingByte.length());

            String delimiter = ",";
            int i = 0;
            while (strstr(cleanString.c_str(), delimiter.c_str()))
            {
                int index = cleanString.indexOf(delimiter);
                String subTemp = cleanString.substring(0, index);
                cleanString = cleanString.substring(index + 1, incomingByte.length());

                params[i] = subTemp.toInt();
                i += 1;
            }

            Braccio.ServoMovement(params[0], params[1], params[2], params[3], params[4], params[5], params[6]);

            Serial.write("Moved Braccio with serial input\n");
        }
        // check if world parameter
        // change according to x, y, z
        else if (strstr(incomingByte.c_str(), world_string.c_str()))
        {
            int params[7];

            // remove first character 'P'
            String cleanString = incomingByte.substring(1, incomingByte.length());

            String delimiter = ",";
            int i = 0;
            while (strstr(cleanString.c_str(), delimiter.c_str()))
            {
                int index = cleanString.indexOf(delimiter);
                String subTemp = cleanString.substring(0, index);
                cleanString = cleanString.substring(index + 1, incomingByte.length());

                params[i] = subTemp.toInt();
                i += 1;
            }

            if (InverseK.solve(params[1], params[2], params[3], a0, a1, a2, a3, b2a(params[4])))
            {
                Braccio.ServoMovement(params[0], a2b(a0), a2b(a1), a2b(a2), a2b(a3), params[5], params[6]);
                Serial.write("Moved Braccio with serial input\n");
            }
            else
            {
                Serial.write("No solution found!");
            }
        }

        else if (strstr(incomingByte.c_str(), image_string.c_str()))
        {
            int i;
            // grab blocks!
            pixy.ccc.getBlocks();

            // If there are detect blocks, print them!
            if (pixy.ccc.numBlocks)
            {
                // Serial.print("Detected ");
                // Serial.println(pixy.ccc.numBlocks);
                for (i = 0; i < pixy.ccc.numBlocks; i++)
                {
                    pixy.ccc.blocks[i].write();
                    Serial.write(", ");
                }
                Serial.write("\n");
            }
        }

        else
        {
            Serial.write("invald input\n");
        }
    }
}

float b2a(float b)
{
    return b / 180.0 * PI - HALF_PI;
}

// Quick conversion from radians to the Braccio angle system
float a2b(float a)
{
    return (a + HALF_PI) * 180 / PI;
}