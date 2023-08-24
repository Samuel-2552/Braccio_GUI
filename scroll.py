import tkinter as tk

def on_mousewheel(event):
    canvas.yview_scroll(int(-1 * (event.delta / 120)), "units")

root = tk.Tk()
root.title("Scrollable GUI")

canvas = tk.Canvas(root)
canvas.pack(fill=tk.BOTH, expand=True)

scrollbar = tk.Scrollbar(root, command=canvas.yview)
scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

canvas.config(yscrollcommand=scrollbar.set)
canvas.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))
root.bind_all("<MouseWheel>", on_mousewheel)

content_frame = tk.Frame(canvas)
canvas.create_window((0, 0), window=content_frame, anchor="nw")

for i in range(50):
    label = tk.Label(content_frame, text=f"Label {i}")
    label.pack()

root.mainloop()
