const container = document.createElement("div");
container.style.overflow = "auto";
container.style.maxHeight = "100vh";
container.style.display = "flex";
container.style.justifyContent = "center";
container.style.alignItems = "center";
container.style.flexDirection = "column";
document.body.appendChild(container);

fetch("assets/js/mesh_list.json")
  .then(res => res.json())
  .then(folders => {
    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.borderCollapse = "collapse";
    table.style.marginTop = "200px";  // 👈 Add space above the table
    // table.style.tableLayout = "fixed";  // 👈 Add this to ensure fixed column widths
    container.appendChild(table);

    // Determine the maximum number of files across all folders
    const maxColumns = Math.max(...folders.map(folder => folder.files.length));

    // Create column header row
    const headerRow = document.createElement("tr");
    const topLeft = document.createElement("th");
    topLeft.innerText = "Folder / File";
    topLeft.style.padding = "10px";
    topLeft.style.border = "1px solid #ccc";
    topLeft.style.fontSize = "18px";            // Increase text size
    topLeft.style.color = "#333366";            // Change color
    headerRow.appendChild(topLeft);

    for (let i = 0; i < maxColumns; i++) {
      const th = document.createElement("th");
      th.innerText = `${i + 1}`;
      th.style.padding = "10px";
      th.style.border = "1px solid #ccc";
      th.style.backgroundColor = "#f0f0f0";
      th.style.fontSize = "100px";              // Increase text size
      th.style.color = "#333366";              // Change color
      headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    // Create data rows
    folders.forEach(folder => {
      const row = document.createElement("tr");

      const folderNameCell = document.createElement("th");
      folderNameCell.innerText = folder.folder;
      folderNameCell.style.padding = "10px";
      folderNameCell.style.fontSize = "18px"; // Match font size
      folderNameCell.style.color = "#333366"; // Match color
      row.appendChild(folderNameCell);

      for (let i = 0; i < maxColumns; i++) {
        const cell = document.createElement("td");
        cell.style.height = "300px";  // 👈 Add a fixed height to cells

        if (folder.files[i]) {
          const canvas = document.createElement("canvas");
          canvas.width = 200;
          canvas.height = 200;
          cell.appendChild(canvas);
          createMeshViewer(canvas, `data/${folder.folder}/${folder.files[i]}`);
        }

        row.appendChild(cell);
      }

      table.appendChild(row);
    }
  );
  });

function createMeshViewer(canvas, objPath) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000);
  camera.position.set(0, 0, 3);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(canvas.width, canvas.height);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = false;

  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.position.set(10, 10, 10);
  scene.add(dirLight);

  const loader = new THREE.OBJLoader();
  loader.load(objPath, object => {
    const box = new THREE.Box3().setFromObject(object);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1.2 / maxDim;

    const group = new THREE.Group();
    object.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({ color: 0x888888 });
      }
    });

    object.position.sub(center);     // center it
    group.add(object);
    group.scale.setScalar(scale);   // scale entire group

    scene.add(group);

    // Animate
    const animate = () => {
      requestAnimationFrame(animate);
      group.rotation.y += 0.01;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  });
}
