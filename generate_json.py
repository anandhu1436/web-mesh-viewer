# generate_file_list.py
import os
import json

data_dir = "data"
output = []

folders = sorted([f for f in os.listdir(data_dir) if os.path.isdir(os.path.join(data_dir, f))])
for folder in folders:
    folder_path = os.path.join(data_dir, folder)
    files = sorted([f for f in os.listdir(folder_path) if f.endswith(".obj")])
    output.append({
        "folder": folder,
        "files": files
    })

with open("assets/js/mesh_list.json", "w") as f:
    json.dump(output, f)
