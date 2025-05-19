import os

def delete_circumsphere_files(root_folder):
    deleted_files = []

    for dirpath, _, filenames in os.walk(root_folder):
        for filename in filenames:
            if filename.endswith("circumspheres.obj"):
                file_path = os.path.join(dirpath, filename)
                try:
                    os.remove(file_path)
                    deleted_files.append(file_path)
                except Exception as e:
                    print(f"❌ Failed to delete {file_path}: {e}")

    print(f"✅ Deleted {len(deleted_files)} file(s):")
    for f in deleted_files:
        print(f" - {f}")

# Example usage:
delete_circumsphere_files("users")
