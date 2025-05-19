import os
import json

def generate_mesh_list(data_root, output_json="assets/js/mesh_list.json"):
    result = []

    for folder_name in os.listdir(data_root):
        folder_path = os.path.join(data_root, folder_name)
        if not os.path.isdir(folder_path):
            continue

        files = [f for f in os.listdir(folder_path)
                 if os.path.isfile(os.path.join(folder_path, f)) and f.lower().endswith(".obj") and "circumsphere" in f.lower() or "final" in f.lower() or "stroke" in f.lower()]

        result.append({
            "folder": folder_name,
            "files": sorted(files)
        })

    with open(output_json, "w") as f:
        json.dump(result, f, indent=2)

    print(f"✅ mesh_list.json generated with {len(result)} folders.")

# Example usage:
generate_mesh_list("users")  # e.g., "data"
