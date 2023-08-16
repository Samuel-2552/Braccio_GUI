import tkinter as tk
from braccio_adapter import BraccioAdapter
from enum import Enum

GUI_TEST = True

if GUI_TEST:
    from dummy import BraccioAdapter

class JoystickApp(BraccioAdapter):
    def __init__(self, root, serial_port_robot_magnet="COM3"):
        super().__init__(serial_port_robot_magnet,)
        self.home_position()
        self.root = root
        self.root.title("Braccio Robot Controller")

        self.m1 = 0
        self.m2 = 43
        self.m3 = 180
        self.m4 = 0
        self.m5 = 170
        self.m6 = 73
        self.speed = 50

        self.points = []
        self.points_alone = []

        self.frame = tk.Frame(self.root)
        self.frame.pack(padx=100, pady=100)

        self.label = tk.Label(self.frame, text="Joint Co-ordinate", font=("Helvetica", 16))
        self.label.grid(row=0, column=2, pady=5)

        #Frame 1

        self.control_frame = tk.Frame(self.frame, borderwidth=2, relief="solid")
        self.control_frame.grid(row=1, column=1, pady=10)

        self.button_up = tk.Button(self.control_frame, text="Shoulder+", command=lambda: self.move_motor('m2', 1))
        self.button_up.grid(row=0, column=1, pady=5)

        self.button_left = tk.Button(self.control_frame, text="Base-", command=lambda: self.move_motor('m1', -1))
        self.button_left.grid(row=1, column=0, padx=5)

        self.button_center = tk.Button(self.control_frame, text="Home", command=self.home)
        self.button_center.grid(row=1, column=1, pady=5)

        self.button_right = tk.Button(self.control_frame, text="Base+", command=lambda: self.move_motor('m1', 1))
        self.button_right.grid(row=1, column=2, padx=5)

        self.button_down = tk.Button(self.control_frame, text="Shoulder-", command=lambda: self.move_motor('m2', -1))
        self.button_down.grid(row=2, column=1, pady=5)
        
        #Frame 2

        self.control_frame = tk.Frame(self.frame, borderwidth=2, relief="solid")
        self.control_frame.grid(row=1, column=2, pady=5)

        self.button_up = tk.Button(self.control_frame, text="M4+", command=lambda: self.move_motor('m4', 1))
        self.button_up.grid(row=0, column=1, pady=5)

        self.button_left = tk.Button(self.control_frame, text="M3-", command=lambda: self.move_motor('m3', -1))
        self.button_left.grid(row=1, column=0, padx=5)

        self.button_center = tk.Button(self.control_frame, text="Safe", command=self.safe)
        self.button_center.grid(row=1, column=1, pady=5)

        self.button_right = tk.Button(self.control_frame, text="M3+", command=lambda: self.move_motor('m3', 1))
        self.button_right.grid(row=1, column=2, padx=5)

        self.button_down = tk.Button(self.control_frame, text="M4-", command=lambda: self.move_motor('m4', -1))
        self.button_down.grid(row=2, column=1, pady=5)

        #Frame 3

        self.control_frame = tk.Frame(self.frame, borderwidth=2, relief="solid")
        self.control_frame.grid(row=1, column=3, pady=5)

        self.button_up = tk.Button(self.control_frame, text="M5+", command=lambda: self.move_motor('m5', 1))
        self.button_up.grid(row=0, column=1, pady=5)

        self.button_left = tk.Button(self.control_frame, text="M6-", command=lambda: self.move_motor('m6', -1))
        self.button_left.grid(row=1, column=0, padx=5)

        self.button_center = tk.Button(self.control_frame, text="Home", command=self.home)
        self.button_center.grid(row=1, column=1, pady=5)

        self.button_right = tk.Button(self.control_frame, text="M6+", command=lambda: self.move_motor('m6', 1))
        self.button_right.grid(row=1, column=2, padx=5)

        self.button_down = tk.Button(self.control_frame, text="M5-", command=lambda: self.move_motor('m5', -1))
        self.button_down.grid(row=2, column=1, pady=5)

        # Angle Slider

        self.Angle = tk.Scale(self.frame, from_=1, to=50, resolution=1, label="Angle Resolution", orient="horizontal")
        self.Angle.grid(row=2, column=2, pady=5)

        # Speed Slider

        self.Speed = tk.Scale(self.frame, from_=10, to=100, resolution=1, label="Speed(High-Low)", orient="horizontal")
        self.Speed.grid(row=3, column=2, pady=5)

        # Text Box

        self.textbox_label = tk.Label(self.frame, text="Current Position", font=("Helvetica", 12))
        self.textbox_label.grid(row=4, column=2, pady=5)

        self.textbox_frame = tk.Frame(self.frame, borderwidth=2, relief="solid")
        self.textbox_frame.grid(row=5, column=2, pady=5)

        self.textbox = tk.Text(self.textbox_frame, height=5, width=60)
        self.textbox.pack(padx=10, pady=5)

        # Add Button for Adding Points
        self.add_button = tk.Button(self.frame, text="Add", height=2, width=10, command=self.add_point)
        self.add_button.grid(row=6, column=2, pady=5)

        # List of Points Text Box
        self.points_label = tk.Label(self.frame, text="Points List", font=("Helvetica", 12))
        self.points_label.grid(row=7, column=2, pady=5)

        self.points_frame = tk.Frame(self.frame, borderwidth=2, relief="solid")
        self.points_frame.grid(row=8, column=2, pady=5)

        self.points_textbox = tk.Text(self.points_frame, height=15, width=60)
        self.points_textbox.pack(padx=10, pady=5)

        # Run Button for Running Program
        self.run_button = tk.Button(self.frame, text="Run", height=2, width=10, command=self.run)
        self.run_button.grid(row=9, column=2, pady=5)

        # Emergency Button for stopping Program
        self.emergency_button = tk.Button(self.frame, text="Emergency Stop",  height=2, width=20, command=self.emergency_stop)
        self.emergency_button.grid(row=9, column=3, pady=5)

        


    def move_motor(self, motor, direction):

        if motor == 'm2':
            lower, upper = 15, 165
        elif motor == 'm6':
            lower, upper = 10, 73
        else:
            lower, upper = 0, 180
            
        increment = self.Angle.get() * direction
        setattr(self, motor, max(min(getattr(self, motor) + increment, upper), lower))
        self.servo_movement(self.m1, self.m2, self.m3, self.m4, self.m5, self.m6, self.Speed.get())
        self.update_textbox()

    def add_point(self):
        point = f"M1: {self.m1}, M2: {self.m2}, M3: {self.m3}, M4: {self.m4}, M5: {self.m5}, M6: {self.m6}, Speed: {self.Speed.get()}"
        point_alone = [self.m1,self.m2,self.m3,self.m4,self.m5,self.m6,self.Speed.get()]
        self.points_alone.append(point_alone)
        self.points.append(point)
        self.update_points_textbox()

    def update_points_textbox(self):
        self.points_textbox.delete('1.0', tk.END)
        for point in self.points:
            self.points_textbox.insert(tk.END, point + "\n")

    def home(self):
        self.m1 = 0
        self.m2 = 43
        self.m3 = 180
        self.m4 = 0
        self.m5 = 170
        self.m6 = 73
        self.servo_movement(self.m1, self.m2, self.m3, self.m4, self.m5, self.m6,self.Speed.get())
        self.update_textbox()

    def run(self):
        for lis in self.points_alone:
            self.servo_movement(lis[0],lis[1],lis[2],lis[3],lis[4],lis[5],lis[6])


    def safe(self):
        self.m1 = 0
        self.m2 = 80
        self.m3 = 90
        self.m4 = 90
        self.m5 = 70
        self.m6 = 73
        self.servo_movement(self.m1, self.m2, self.m3, self.m4, self.m5, self.m6,self.Speed.get())

    def update_textbox(self):
        self.textbox.delete('1.0', tk.END)
        self.textbox.insert(tk.END, f"Angle Resolution: {self.Angle.get():0}\nM1: {self.m1:0}, M2: {self.m2:0}, M3: {self.m3:0}, M4: {self.m4:0}, M5: {self.m5:0}, M6: {self.m6:0}, Speed: {self.Speed.get()}")

    def emergency_stop(self):
        # Perform actions to stop the program immediately
        # For example, you can exit the GUI or stop the robotic arm's movement.
        # You might need to adjust these actions based on your specific requirements.
        self.root.destroy()  # Exit the GUI

if __name__ == "__main__":
    root = tk.Tk()
    app = JoystickApp(root,serial_port_robot_magnet="COM3")
    root.mainloop()
