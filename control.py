import serial
import time

# Open a serial connection to the Braccio robotic arm
ser = serial.Serial('COM9', 9600)  # Change the port name as needed
time.sleep(2)  # Allow time for the connection to establish

# Define the servo values (m1 to m6)
m1 = 180
m2 = 43
m3 = 180
m4 = 0
m5 = 170
m6 = 73

# Format the command string
command = f"#{m1}P{m2}P{m3}P{m4}P{m5}P{m6}P\n"

# Send the command to the Braccio
ser.write(command.encode())

# Close the serial connection
ser.close()
