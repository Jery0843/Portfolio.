<script lang="ts">
    import { onMount } from 'svelte';
    let host: HTMLDivElement;
    let canvas: HTMLCanvasElement;
    let running = $state(true);
    let ready = $state(false);
    let setRunning = (_value: boolean) => {};
    onMount(() => {
        let disposed = false;
        let cleanup = () => {};
        const preference = matchMedia('(prefers-reduced-motion: reduce)');
        running = !preference.matches;
        import('$lib/visuals/security-core').then(({ createSecurityCore }) => {
            if (disposed) return;
            const scene = createSecurityCore(canvas, host);
            setRunning = scene.setRunning;
            setRunning(running);
            cleanup = scene.destroy;
            ready = true;
        }).catch(() => { ready = false; });
        const update = () => { running = !preference.matches; setRunning(running); };
        preference.addEventListener('change', update);
        return () => { disposed = true; cleanup(); preference.removeEventListener('change', update); };
    });
</script>
<div class="core-visual" bind:this={host}>
    <div class="core-fallback" class:rendered={ready} aria-hidden="true"><div class="fallback-orbit"></div><div class="fallback-orbit second"></div><div class="fallback-core"></div></div>
    <canvas bind:this={canvas} class:ready aria-label="An abstract security core surrounded by orbiting circuit rings"></canvas>
    <div class="core-corner corner-top" aria-hidden="true">FIG. 001<br/>SECURITY CORE</div>
    <div class="core-corner corner-bottom" aria-hidden="true">SYS://0xJERRY<br/><span>ENCRYPTED BY DESIGN</span></div>
    <button class="motion-button" onclick={() => { running = !running; setRunning(running); }} aria-pressed={!running} aria-label={running ? 'Pause background animation' : 'Resume background animation'}>{running ? 'Ⅱ PAUSE MOTION' : '▷ RESUME MOTION'}</button>
</div>
