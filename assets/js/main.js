fetch("assets/js/mesh_list.json")
  .then(res => res.json())
  .then(folders => {
    const table = document.createElement("table");
    document.body.appendChild(table);

    folders.forEach((folder, rowIndex) => {
      const row = document.createElement("tr");
      table.appendChild(row);

      folder.files.forEach((file, colIndex) => {
        const cell = document.createElement("td");
        const canvas = document.createElement("canvas");
        canvas.width = 300;
        canvas.height = 300;
        cell.appendChild(canvas);
        row.appendChild(cell);

        createMeshViewer(canvas, `data/${folder.folder}/${file}`);
      });
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

    object.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({ color: 0x888888 });
      }
    });

    object.scale.setScalar(scale);
    object.position.sub(center.multiplyScalar(scale));

    scene.add(object);

    // Animate
    const animate = () => {
      requestAnimationFrame(animate);
      object.rotation.y += 0.01;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  });
}
