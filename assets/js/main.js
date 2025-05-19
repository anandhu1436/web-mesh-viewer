const container = document.createElement("div");
container.style.overflow = "auto";
container.style.maxHeight = "100vh";
container.style.display = "flex";
container.style.justifyContent = "center";
container.style.alignItems = "center";
container.style.flexDirection = "column";
document.body.appendChild(container);

// Extract folder name from URL path
// const pathParts = window.location.pathname.split('/');

// Get folder name from URL like ?folder=lin
const urlParams = new URLSearchParams(window.location.search);
const targetFolder = urlParams.get("folder") || "default";  // fallback if not given


fetch("assets/js/mesh_list.json")
  .then(res => res.json())
  .then(folders => {
    const folder = folders.find(f => f.folder === targetFolder);
    if (!folder) {
      const msg = document.createElement("p");
      msg.innerText = `Folder "${targetFolder}" not found.`;
      msg.style.fontSize = "20px";
      msg.style.color = "red";
      container.appendChild(msg);
      return;
    }

    const groups = [
      { label: "Strokes", files: folder.files.filter(f => f.toLowerCase().includes("strokes")) },
      { label: "Marching", files: folder.files.filter(f => f.toLowerCase().includes("circumspheres")) },
      { label: "Final", files: folder.files.filter(f => f.toLowerCase().includes("final")) }
    ];

    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.marginTop = "100px";
    container.appendChild(table);

    groups.forEach(group => {
      const row = document.createElement("tr");

      const labelCell = document.createElement("th");
      labelCell.innerText = group.label;
      labelCell.style.padding = "10px";
      labelCell.style.border = "1px solid #ccc";
      labelCell.style.fontSize = "18px";
      labelCell.style.color = "#333366";
      row.appendChild(labelCell);

      group.files.forEach(file => {
        const cell = document.createElement("td");
        cell.style.height = "300px";
        const canvas = document.createElement("canvas");
        canvas.width = 200;
        canvas.height = 200;
        cell.appendChild(canvas);
        createMeshViewer(canvas, `users/${folder.folder}/${file}`);
        row.appendChild(cell);
      });

      table.appendChild(row);
    });
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

    object.position.sub(center);
    group.add(object);
    group.scale.setScalar(scale);
    scene.add(group);

    const animate = () => {
      requestAnimationFrame(animate);
      group.rotation.y += 0.01;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  });
}
