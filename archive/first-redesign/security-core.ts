import * as THREE from 'three';

export function createSecurityCore(canvas: HTMLCanvasElement, host: HTMLElement) {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);
    camera.position.set(0, 0, 9.5);
    const core = new THREE.Group();
    scene.add(core);
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const geometry = <T extends THREE.BufferGeometry>(g: T) => { geometries.push(g); return g; };
    const material = <T extends THREE.Material>(m: T) => { materials.push(m); return m; };
    const green = new THREE.Color('#b8ff65');
    const wire = material(new THREE.MeshBasicMaterial({ color: green, wireframe: true, transparent: true, opacity: 0.34 }));
    const center = new THREE.Mesh(geometry(new THREE.IcosahedronGeometry(1.02, 1)), wire);
    core.add(center);
    const metal = material(new THREE.MeshStandardMaterial({ color: '#1c2825', metalness: 0.92, roughness: 0.33 }));
    const shell = new THREE.Mesh(geometry(new THREE.IcosahedronGeometry(0.93, 0)), metal);
    core.add(shell);
    const light = new THREE.PointLight('#b8ff65', 28, 20);
    light.position.set(-3, 3, 4); scene.add(light);
    const rim = new THREE.PointLight('#54ccd1', 20, 20);
    rim.position.set(3, -2, 2); scene.add(rim);
    scene.add(new THREE.AmbientLight('#a8c1ae', 0.7));
    const ringMaterial = material(new THREE.MeshStandardMaterial({ color: '#42604a', metalness: 0.86, roughness: 0.35 }));
    const glowMaterial = material(new THREE.MeshBasicMaterial({ color: green, transparent: true, opacity: 0.85 }));
    const dimMaterial = material(new THREE.LineBasicMaterial({ color: green, transparent: true, opacity: 0.14 }));
    const rings: THREE.Group[] = [];
    for (let i = 0; i < 3; i++) {
        const group = new THREE.Group();
        const radius = 1.45 + i * 0.42;
        group.add(new THREE.Mesh(geometry(new THREE.TorusGeometry(radius, 0.043, 8, 160)), ringMaterial));
        group.add(new THREE.Mesh(geometry(new THREE.TorusGeometry(radius + 0.075, 0.007, 4, 160, Math.PI * 1.4)), glowMaterial));
        const tickGeometry = geometry(new THREE.BoxGeometry(0.017, 0.08, 0.035));
        for (let j = 0; j < 64; j++) {
            const angle = j / 64 * Math.PI * 2;
            const tick = new THREE.Mesh(tickGeometry, j % 8 === 0 ? glowMaterial : ringMaterial);
            tick.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
            tick.rotation.z = angle - Math.PI / 2;
            group.add(tick);
        }
        group.rotation.set(0.65 + i * 0.45, i * 0.6 - 0.4, i * 0.7);
        core.add(group); rings.push(group);
    }
    const gridPositions: number[] = [];
    for (let i = -6; i <= 6; i++) {
        gridPositions.push(i * 0.6, -3.6, -2.5, i * 0.6, 3.6, -2.5, -3.6, i * 0.6, -2.5, 3.6, i * 0.6, -2.5);
    }
    const grid = geometry(new THREE.BufferGeometry());
    grid.setAttribute('position', new THREE.Float32BufferAttribute(gridPositions, 3));
    scene.add(new THREE.LineSegments(grid, dimMaterial));
    const starPositions: number[] = [];
    for (let i = 0; i < 180; i++) {
        // Deterministic scatter keeps the scene stable across visits.
        starPositions.push(Math.sin(i * 127.1) * 4, Math.cos(i * 311.7) * 3.5, -1 - (i % 30) / 10);
    }
    const starsGeo = geometry(new THREE.BufferGeometry());
    starsGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(starsGeo, material(new THREE.PointsMaterial({ color: green, size: 0.018, transparent: true, opacity: 0.5 })));
    scene.add(stars);
    let frame = 0;
    let running = true;
    let visible = true;
    let destroyed = false;
    let elapsed = 0;
    let last = 0;
    const pointer = new THREE.Vector2();
    function resize() {
        const { width, height } = host.getBoundingClientRect();
        renderer.setSize(width, height, false);
        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
    }
    function draw(time: number) {
        frame = 0;
        if (destroyed) return;
        if (last) elapsed += Math.min(time - last, 50) / 1000;
        last = time;
        rings.forEach((ring, i) => { ring.rotation.z = elapsed * (0.07 + i * 0.025) * (i % 2 ? -1 : 1) + i * 0.7; });
        center.rotation.y = elapsed * 0.13;
        shell.rotation.y = elapsed * 0.13;
        core.rotation.y += (pointer.x * 0.22 - core.rotation.y) * 0.025;
        core.rotation.x += (-pointer.y * 0.16 - core.rotation.x) * 0.025;
        core.position.y = Math.sin(elapsed * 0.5) * 0.07;
        renderer.render(scene, camera);
        if (running && visible && !document.hidden) frame = requestAnimationFrame(draw);
    }
    function resume() { last = 0; if (!frame && running && visible && !document.hidden && !destroyed) frame = requestAnimationFrame(draw); }
    function move(event: PointerEvent) {
        const rect = host.getBoundingClientRect();
        pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, (event.clientY - rect.top) / rect.height * 2 - 1);
    }
    function reset() { pointer.set(0, 0); }
    const observer = new ResizeObserver(resize); observer.observe(host);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) { cancelAnimationFrame(frame); frame = 0; } else resume(); });
    intersection.observe(host);
    function visibility() { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else resume(); }
    document.addEventListener('visibilitychange', visibility);
    host.addEventListener('pointermove', move); host.addEventListener('pointerleave', reset);
    resize(); renderer.render(scene, camera); resume();
    return {
        setRunning(value: boolean) { running = value; if (!value) { cancelAnimationFrame(frame); frame = 0; } else resume(); },
        destroy() {
            destroyed = true; cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect();
            host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', reset);
            document.removeEventListener('visibilitychange', visibility);
            geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); renderer.dispose();
        }
    };
}
