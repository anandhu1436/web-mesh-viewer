
## 📥 Instructions

1. **Place Mesh Files:**
   - Create one folder per row inside the `data/` directory.
   - Each folder should contain `.obj` files for that row.

2. **Generate JSON File:**
   - Run the provided Python script:
     ```bash
     python generate_json.py
     ```
   - This will generate the required `mesh_list.json` inside `assets/js/`.

3. **Launch the Viewer:**
   - Open `index.html` in your web browser to view and interact with the mesh grid.

## 🛠 Dependencies

- Three.js
- OrbitControls
- OBJLoader

You can include these via CDN in your `index.html`.

---

Happy viewing!
