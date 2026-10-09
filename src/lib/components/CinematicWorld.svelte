<script lang="ts">
    import { onMount } from 'svelte';
    let { scene = 'cybercity', subdued = false, running = $bindable(true) }: { scene?: string; subdued?: boolean; running?: boolean } = $props();
    let canvas: HTMLCanvasElement;
    let ready = $state(false);
    let setRunning = (_value: boolean) => {};
    $effect(() => { setRunning(running); });
    onMount(() => {
        let disposed = false;
        let cleanup = () => {};
        import('$lib/visuals/cinematic-world').then(async ({ createCinematicWorld }) => {
            if (disposed) return;
            const world = await createCinematicWorld(canvas, scene);
            if (disposed) { world.destroy(); return; }
            setRunning = world.setRunning;
            setRunning(running);
            cleanup = world.destroy;
            ready = true;
        }).catch(() => { /* The original artwork remains visible without WebGL. */ });
        return () => { disposed = true; cleanup(); };
    });
</script>
<svelte:head>
    <link rel="preload" as="image" href={`/world/${scene}.webp`} media="(min-width: 761px)" />
    <link rel="preload" as="image" href={`/world/${scene}-mobile.webp`} media="(max-width: 760px)" />
</svelte:head>
<div class="cinematic-world" class:subdued aria-hidden="true">
    <picture><source media="(max-width: 760px)" srcset={`/world/${scene}-mobile.webp`}/><img src={`/world/${scene}.webp`} alt="" width="1672" height="941" fetchpriority="high" /></picture>
    <canvas bind:this={canvas} class:ready></canvas>
    <div class="world-vignette"></div>
    <div class="world-grain"></div>
</div>
<button class="world-motion" onclick={() => { running = !running; setRunning(running); }} aria-pressed={!running} aria-label={running ? 'Pause atmospheric animation' : 'Resume atmospheric animation'}>{running ? 'Ⅱ' : '▷'}<span>{running ? 'STILL THE WORLD' : 'AWAKEN THE WORLD'}</span></button>
