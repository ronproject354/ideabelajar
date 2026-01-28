// Three.js Immersive Setup for Solar System Explorer
let scene, camera, renderer;
let planetMesh, atmosphereMesh, ringMesh;
let starsMesh, starGeo;
let targetRotationX = 0;
let targetRotationY = 0;
let isTransitioning = false;

// Setup interaksi
let mouseX = 0;
let mouseY = 0;

function init3D() {
    const container = document.getElementById('planet-container');

    // 1. Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.02); // Kabut hitam untuk kedalaman

    // 2. Camera
    camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true; // Aktifkan bayangan
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Bayangan yang lebih lembut
    container.innerHTML = ''; // Clear container
    container.appendChild(renderer.domElement);

    // 4. Lighting - Cinematic Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6); // Soft base light
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(-10, 5, 5);
    sunLight.castShadow = true; // Matahari menghasilkan bayangan

    // Konfigurasi kamera bayangan agar pas dengan objek planet
    sunLight.shadow.camera.left = -10;
    sunLight.shadow.camera.right = 10;
    sunLight.shadow.camera.top = 10;
    sunLight.shadow.camera.bottom = -10;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;

    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x4455ff, 0.5); // Cool rim light from back
    rimLight.position.set(5, 5, -5);
    scene.add(rimLight);

    // 5. Starfield Environment
    createImmersiveStars();

    // 6. Init Planet Default
    createImmersivePlanet('bumi');

    // 7. Event Listeners
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    // Touch events untuk rotasi manual di mobile
    let touchStartX = 0;
    let touchStartY = 0;

    container.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: false });

    container.addEventListener('touchmove', (e) => {
        // Hanya rotasi jika gerakan lebih horizontal (untuk cegah konflik scroll)
        let deltaX = e.touches[0].clientX - touchStartX;
        let deltaY = e.touches[0].clientY - touchStartY;

        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;

        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;

        // Cegah halaman scroll saat memutar planet
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            e.preventDefault();
        }
    }, { passive: false });

    // Start Loop
    animate();
}

function createImmersiveStars() {
    starGeo = new THREE.BufferGeometry();
    const starCount = 4000; // Lebih banyak bintang
    const posArray = new Float32Array(starCount * 3);
    const colorArray = new Float32Array(starCount * 3);
    const sizeArray = new Float32Array(starCount);

    const colors = [
        new THREE.Color(0xffffff), // White
        new THREE.Color(0xaaccff), // Soft Blue
        new THREE.Color(0xfff0aa), // Soft Yellow
        new THREE.Color(0xffcccc)  // Soft Red/Pink
    ];

    for (let i = 0; i < starCount; i++) {
        // Posisi luas (Sphere distribution)
        const i3 = i * 3;
        posArray[i3] = (Math.random() - 0.5) * 150;
        posArray[i3 + 1] = (Math.random() - 0.5) * 150;
        posArray[i3 + 2] = (Math.random() - 0.5) * 100 - 30;

        // Warna acak
        const color = colors[Math.floor(Math.random() * colors.length)];
        colorArray[i3] = color.r;
        colorArray[i3 + 1] = color.g;
        colorArray[i3 + 2] = color.b;

        // Ukuran acak
        sizeArray[i] = Math.random();
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));

    const material = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true, // Gunakan warna individual
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    starsMesh = new THREE.Points(starGeo, material);
    scene.add(starsMesh);
}

// Fungsi Transisi Warp Speed
function triggerWarpSpeed() {
    isTransitioning = true;

    // Zoom out planet effect
    if (planetMesh) {
        const tweenScale = { s: 1 };
        // Simple scale down animation logic would be here, 
        // but we'll use pure JS render loop logic for consistency
    }

    setTimeout(() => {
        isTransitioning = false;
    }, 1000); // 1 detik warp
}

function createImmersivePlanet(planetId) {
    if (planetMesh) {
        scene.remove(planetMesh);
        planetMesh.geometry.dispose();
        planetMesh.material.dispose();
    }
    if (atmosphereMesh) {
        scene.remove(atmosphereMesh);
        atmosphereMesh.geometry.dispose();
        atmosphereMesh.material.dispose();
    }
    if (ringMesh) {
        scene.remove(ringMesh);
        ringMesh.geometry.dispose();
        ringMesh.material.dispose();
        ringMesh = null;
    }

    const planetData = typeof tataSuryaData !== 'undefined' ? tataSuryaData.find(p => p.id === planetId) : null;
    const baseColor = planetData ? planetData.glowColor : '#4488ff';

    // 1. Core Planet
    const geometry = new THREE.SphereGeometry(2, 64, 64);

    // Material Shader-like standar
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff, // Base white untuk terima texture
        roughness: 0.8,
        metalness: 0.1,
        transparent: true, // Support PNG transparency
    });

    // Texture Loading dengan Fallback
    if (planetData && planetData.gambar) {
        new THREE.TextureLoader().load(planetData.gambar,
            (tex) => {
                tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
                tex.minFilter = THREE.LinearFilter;
                material.map = tex;
                material.needsUpdate = true;
            },
            undefined,
            (err) => {
                console.error('Failed to load texture:', err);
                material.color.set(baseColor); // Fallback color
            }
        );
    } else {
        material.color.set(baseColor);
    }

    planetMesh = new THREE.Mesh(geometry, material);
    planetMesh.castShadow = true; // Planet memproyeksikan bayangan
    planetMesh.receiveShadow = true; // Planet juga bisa menerima bayangan (misal dari cincin)
    scene.add(planetMesh);

    // 2. Atmosphere Glow (Bagian belakang yang lebih besar)
    const atmoGeometry = new THREE.SphereGeometry(2.2, 32, 32);
    const atmoMaterial = new THREE.MeshBasicMaterial({
        color: baseColor,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide // Render bagian dalam untuk efek halo
    });
    atmosphereMesh = new THREE.Mesh(atmoGeometry, atmoMaterial);
    scene.add(atmosphereMesh);

    // 3. Khusus Saturnus: Tambah Cincin Realistis
    if (planetId === 'saturnus') {
        const ringGeo = new THREE.RingGeometry(2.6, 4.8, 128);

        // Membuat tekstur cincin prosedural (Lingkaran-lingkaran konsentris detail)
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        const centerX = 512;
        const centerY = 512;

        // Buat ribuan cincin tipis untuk tekstur yang sangat detail
        for (let r = 250; r < 500; r++) {
            const opacity = 0.1 + Math.random() * 0.5;
            // Warna dasar krem es Saturnus
            const rCol = 210 + Math.random() * 40;
            const gCol = 190 + Math.random() * 30;
            const bCol = 160 + Math.random() * 20;

            // Simulasikan struktur cincin nyata
            let finalOpacity = opacity;
            // Cassini Division (Celah paling lebar)
            if (r > 380 && r < 400) finalOpacity = 0.03;
            // Encke Gap-like
            if (r > 460 && r < 465) finalOpacity = 0.05;
            // Bagian dalam yang lebih tipis (C Ring)
            if (r < 300) finalOpacity *= 0.4;

            ctx.strokeStyle = `rgba(${rCol},${gCol},${bCol},${finalOpacity})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
            ctx.stroke();
        }

        const ringTexture = new THREE.CanvasTexture(canvas);
        ringTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

        const ringMat = new THREE.MeshStandardMaterial({
            map: ringTexture,
            side: THREE.BackSide, // Render bagian belakang saja untuk menghindari glitch overlapping
            transparent: true,
            opacity: 0.9,
            roughness: 0.3,
            metalness: 0.1
        });

        // Layer kedua untuk sisi depan (DoubleSide terkadang bermasalah dengan transparansi depth)
        const ringMatFront = ringMat.clone();
        ringMatFront.side = THREE.FrontSide;

        ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.receiveShadow = true; // Cincin menerima bayangan dari planet

        const ringMeshFront = new THREE.Mesh(ringGeo, ringMatFront);
        ringMeshFront.receiveShadow = true;
        ringMesh.add(ringMeshFront); // Gabungkan agar bergerak bersama

        // Miringkan cincin agar terlihat natural
        ringMesh.rotation.x = Math.PI / 2.3;
        ringMesh.rotation.y = 0.15;

        scene.add(ringMesh);
    }

    // 4. Responsive Positioning
    updatePlanetPosition();

    // Reset Rotasi
    planetMesh.rotation.y = -1.5; // Mulai menghadap agak ke samping
}

function updatePlanetPosition() {
    if (!planetMesh || !atmosphereMesh) return;

    // Jika desktop (lg), geser planet ke kiri agar tidak tertutup info panel
    if (window.innerWidth >= 1024) {
        planetMesh.position.x = -1.5;
        atmosphereMesh.position.x = -1.5;
        if (ringMesh) ringMesh.position.x = -1.5;
    } else {
        // Center on mobile
        planetMesh.position.x = 0;
        atmosphereMesh.position.x = 0;
        if (ringMesh) ringMesh.position.x = 0;

        // Sedikit ke atas di mobile agar tidak tertutup slider (optional)
        planetMesh.position.y = 0.5;
        atmosphereMesh.position.y = 0.5;
        if (ringMesh) ringMesh.position.y = 0.5;
    }
}

function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    updatePlanetPosition();
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.0005;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.0005;
}

function animate() {
    requestAnimationFrame(animate);

    // Starfield Animation (Realistic Movement & Twinkle)
    if (starsMesh) {
        const positions = starsMesh.geometry.attributes.position.array;
        const starColors = starsMesh.geometry.attributes.color.array;

        for (let i = 0; i < positions.length; i += 3) {
            // Pergerakan Z (Warp Speed saat transisi)
            positions[i + 2] += isTransitioning ? 3.0 : 0.03;

            // Efek kedip (Twinkle) - Memainkan intensitas warna secara halus
            const twinkle = 0.8 + Math.sin(Date.now() * 0.005 + i) * 0.2;
            starColors[i] *= twinkle; // R
            starColors[i + 1] *= twinkle; // G
            starColors[i + 2] *= twinkle; // B

            // Reset bintang jika lewat kamera
            if (positions[i + 2] > 10) {
                positions[i + 2] = -90;
            }
        }
        starsMesh.geometry.attributes.position.needsUpdate = true;
        // Kita tidak update color setiap frame untuk performa, 
        // tapi jika ingin kedip sangat halus aktifkan line di bawah:
        // starsMesh.geometry.attributes.color.needsUpdate = true;
    }

    // Planet Animation
    if (planetMesh) {
        // Auto rotate
        planetMesh.rotation.y += 0.002;

        // Interactive rotate (Smooth follow mouse)
        targetRotationY += (mouseX - targetRotationY) * 0.05;
        targetRotationX += (mouseY - targetRotationX) * 0.05;

        // Apply extra rotation from interactivity
        planetMesh.rotation.y += mouseX * 0.5;
        planetMesh.rotation.x += mouseY * 0.5;

        // Clamp X rotation agar tidak terbalik
        planetMesh.rotation.x = Math.max(Math.min(planetMesh.rotation.x, 0.5), -0.5);

        // Atmosphere follows planet
        if (atmosphereMesh) {
            atmosphereMesh.rotation.copy(planetMesh.rotation);
        }

        // Ring follows planet rotation with tilt
        if (ringMesh) {
            ringMesh.rotation.z -= 0.001; // Tambahan rotasi cincin
        }
    }

    // Zoom in/out effect logic sederhana
    if (isTransitioning) {
        // Saat warp, kamera mundur sedikit (FOV effect)
        camera.fov = 75;
    } else {
        // Kembali normal
        camera.fov = 60;
    }
    camera.updateProjectionMatrix();

    renderer.render(scene, camera);
}

// Global hook
window.update3DPlanet = function (id) {
    triggerWarpSpeed(); // Efek bintang cepat
    setTimeout(() => {
        createImmersivePlanet(id); // Ganti planet
    }, 300); // Delay sedikit agar smooth
};

// Init call
document.addEventListener('DOMContentLoaded', init3D);
