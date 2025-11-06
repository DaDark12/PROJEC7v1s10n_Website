// 3ddesign.js - Vanta background + Three.js rotating object
// Note: three.js and vanta must be loaded (see index.html script tags)

(function () {
  // Wait for DOM + libs
  const initWhenReady = () => {
    if (typeof VANTA === 'undefined' || typeof THREE === 'undefined' || !document.getElementById('vanta-bg')) {
      // try again later
      setTimeout(initWhenReady, 200);
      return;
    }

    // 1) VANTA NET background (hero)
    try {
      VANTA.NET({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0xff0000,
        backgroundColor: 0x000000,
        points: 10.00,
        maxDistance: 20.00,
        spacing: 15.00
      });
    } catch (err) {
      console.warn('Vanta failed to initialize:', err);
    }

    // 2) Three.js rotating wireframe "idea crystal"
    const container = document.getElementById('3d-object-canvas');
    if (!container) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    renderer.setPixelRatio(DPR);
    container.appendChild(renderer.domElement);

    // Scene + Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.z = 3;

    // Light (soft)
    const amb = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xff4d4d, 0.4);
    dir.position.set(5, 5, 5);
    scene.add(dir);

    // Geometry + Material
    const geometry = new THREE.IcosahedronGeometry(1.05, 0);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff3b3b,
      metalness: 0.1,
      roughness: 0.5,
      emissive: 0x220000,
      transparent: true,
      opacity: 0.9
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    const wire = new THREE.Mesh(geometry.clone(), wireMat);
    scene.add(wire);

    // Resize handler
    function resize() {
      const width = container.clientWidth;
      const height = Math.max(180, Math.min(300, Math.floor(width * 0.55))); // responsive height
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    // Animation loop
    let last = 0;
    function animate(ts) {
      const delta = (ts - last) / 1000;
      last = ts;
      // subtle rotations
      mesh.rotation.x += 0.6 * delta;
      mesh.rotation.y += 0.4 * delta;
      wire.rotation.x += 0.7 * delta;
      wire.rotation.y += 0.45 * delta;

      // gentle bob
      mesh.position.y = Math.sin(ts / 2000) * 0.05;
      wire.position.y = mesh.position.y;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  };

  initWhenReady();
})();
