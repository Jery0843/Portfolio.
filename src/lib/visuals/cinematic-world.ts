import * as THREE from 'three';

// One texture, one full-screen draw: living artwork, with no geometric animation.
export async function createCinematicWorld(canvas: HTMLCanvasElement, sceneName: string) {
    const texture = await new THREE.TextureLoader().loadAsync(matchMedia('(max-width: 760px)').matches ? `/world/${sceneName}-mobile.webp` : `/world/${sceneName}.webp`);
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' }); }
    catch (error) { texture.dispose(); throw error; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.25));
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
        uImage: { value: texture }, uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2() }, uAspect: { value: 1 },
        uImageAspect: { value: texture.image.width / texture.image.height }, uScroll: { value: 0 },
        uMotion: { value: 1 }
    };
    const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
        fragmentShader: `
            precision highp float;
            uniform sampler2D uImage;
            uniform float uTime,uAspect,uImageAspect,uScroll,uMotion;
            uniform vec2 uPointer;
            varying vec2 vUv;
            float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
            float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
            float mist(vec2 p){return noise(p)*.57+noise(p*2.03)*.28+noise(p*4.07)*.15;}
            void main(){
                vec2 uv=vUv;
                vec2 fit=vec2(min(uAspect/uImageAspect,1.),min(uImageAspect/uAspect,1.));
                // Preserve the operative on narrow screens rather than centering the empty city.
                vec2 center=vec2(uAspect<.85?.68:.5,.5);
                uv=(uv-.5)*fit*.97+center;
                float foreground=exp(-dot((uv-vec2(.75,.35))*vec2(4.,2.),(uv-vec2(.75,.35))*vec2(4.,2.)));
                uv+=uPointer*.006*(1.+foreground*1.8)*uMotion;
                uv.y+=min(uScroll,1.)*.012*uMotion;
                float water=1.-smoothstep(.1,.3,uv.y);
                uv.x+=sin(uv.y*110.+uTime*.7)*.0015*water*uMotion;
                uv.x+=sin(uv.y*20.+uTime*.65)*.001*foreground*uMotion;
                vec3 color=texture2D(uImage,uv).rgb;
                float fog=mist(uv*vec2(4.,3.)+vec2(uTime*.027,-uTime*.009));
                float fogBand=(1.-smoothstep(.3,.8,uv.y))*smoothstep(0.,.1,uv.y);
                color=mix(color,vec3(.28,.40,.39),fog*fogBand*.16);
                // Slowly breathing light comes from the shard already in the painting.
                float shard=exp(-length((uv-vec2(.656,.522))*vec2(18.,16.)));
                color+=vec3(.14,.31,.25)*shard*(.35+.15*sin(uTime*.8));
                float grain=(hash(vUv*vec2(1700.,900.)+floor(uTime*12.))-.5)*.015;
                gl_FragColor=vec4(color+grain,1.);
            }
        `,
        depthTest: false, depthWrite: false
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));
    let running = true;
    let destroyed = false;
    let frame = 0;
    let last = 0;
    const target = new THREE.Vector2();
    let scrollTarget = 0;
    function render(time: number) {
        frame = 0;
        if (destroyed) return;
        if (running && last) uniforms.uTime.value += Math.min(time - last, 50) / 1000;
        last = time;
        uniforms.uPointer.value.lerp(target, .035);
        uniforms.uScroll.value += (scrollTarget - uniforms.uScroll.value) * .025;
        renderer.render(scene, camera);
        if (running && !document.hidden) frame = requestAnimationFrame(render);
    }
    function resume() { last = 0; if (!destroyed && !frame && running && !document.hidden) frame = requestAnimationFrame(render); }
    function resize() {
        renderer.setSize(innerWidth, innerHeight, false);
        uniforms.uAspect.value = innerWidth / innerHeight;
        renderer.render(scene, camera);
    }
    function pointer(event: PointerEvent) { if (event.pointerType === 'mouse') target.set(event.clientX / innerWidth * 2 - 1, 1 - event.clientY / innerHeight * 2); }
    function reset() { target.set(0, 0); }
    function scroll() { scrollTarget = window.scrollY / innerHeight; }
    function visibility() { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else resume(); }
    function contextLost(event: Event) { event.preventDefault(); running = false; cancelAnimationFrame(frame); canvas.style.opacity = '0'; }
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', pointer, { passive: true });
    document.addEventListener('pointerleave', reset);
    window.addEventListener('scroll', scroll, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    canvas.addEventListener('webglcontextlost', contextLost);
    resize(); resume();
    return {
        setRunning(value: boolean) {
            running = value; uniforms.uMotion.value = value ? 1 : 0;
            if (!value) { cancelAnimationFrame(frame); frame = 0; uniforms.uPointer.value.set(0, 0); renderer.render(scene, camera); }
            else resume();
        },
        destroy() {
            destroyed = true; cancelAnimationFrame(frame);
            window.removeEventListener('resize', resize); window.removeEventListener('pointermove', pointer);
            document.removeEventListener('pointerleave', reset); window.removeEventListener('scroll', scroll);
            document.removeEventListener('visibilitychange', visibility); canvas.removeEventListener('webglcontextlost', contextLost);
            geometry.dispose(); material.dispose(); texture.dispose(); renderer.dispose();
        }
    };
}
