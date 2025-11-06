document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Vanta.js 3D Background ---
    // Initialize the animated background on the hero section
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
            color: 0xff0000,      // Bright red
            backgroundColor: 0x0, // Black
            points: 10.00,
            maxDistance: 20.00,
            spacing: 15.00
        });
    } catch (e) {
        console.warn("Vanta.js failed to initialize:", e);
        document.getElementById('vanta-bg').style.backgroundColor = '#000';
    }

    
    // --- 2. Three.js 3D Rotating Object ---
    // Initialize the rotating "idea crystal" in the feature card
    try {
        const container = document.getElementById('3d-object-canvas');
        if (container) {
            const scene = new THREE.Scene();
            
            // Camera
            const camera = new THREE.PerspectiveCamera(75, container.clientWidth / 250, 0.1, 1000); // 250 is fallback height
            camera.position.z = 3;

            // Renderer
            const renderer = new THREE.WebGLRenderer({ alpha: true }); // Alpha: true for transparent bg
            renderer.setSize(container.clientWidth, 250); // Use fixed height
            container.appendChild(renderer.domElement);

            // Object: A red wireframe Icosahedron (a "crystal")
            const geometry = new THREE.IcosahedronGeometry(1.2);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0xff0000, // Red
                wireframe: true 
            });
            const icosahedron = new THREE.Mesh(geometry, material);
            scene.add(icosahedron);

            // Animation Loop
            function animate() {
                requestAnimationFrame(animate);
                
                // Rotate the object
                icosahedron.rotation.x += 0.005;
                icosahedron.rotation.y += 0.005;

                renderer.render(scene, camera);
            }
            animate();

            // Handle Resize
            function onResize() {
                if(container.clientWidth > 0) {
                    const width = container.clientWidth;
                    const height = 250; // Keep fixed height
                    camera.aspect = width / height;
                    camera.updateProjectionMatrix();
                    renderer.setSize(width, height);
                }
            }
            window.addEventListener('resize', onResize, false);
            onResize(); // Call once to set initial size
        }
    } catch (e) {
        console.warn("Three.js object failed to initialize:", e);
    }

    
    // --- 3. Scroll Reveal Animation ---
    // Use IntersectionObserver to add/remove classes
    const revealElements = document.querySelectorAll(".scroll-reveal-init");
    
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1 // 10% of element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("scroll-reveal-active");
                // Optional: stop observing once it's visible
                // observer.unobserve(entry.target); 
            } else {
                // Optional: remove to re-animate on scroll up
                // entry.target.classList.remove("scroll-reveal-active");
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        observer.observe(el);
    });
});
