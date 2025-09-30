<script lang="ts">
import { onMount } from 'svelte';

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

interface CodeRain {
    x: number;
    y: number;
    character: string;
    speed: number;
}

let codeRain: CodeRain[] = [];

function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d')!;
}

function generateCodeRain() {
    const columns = canvas.width / 10;
    for (let x = 0; x < columns; x++) {
    const speed = Math.random() * 5 + 2;
    codeRain.push({
        x: x * 10,
        y: Math.random() * -canvas.height,
        character: String.fromCharCode(Math.random() * 128),
        speed
    });
    }
}

function animateCodeRain() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f0';
    const gradient = ctx.createLinearGradient(0, drop.y - 20, 0, drop.y);
    gradient.addColorStop(0, 'rgba(0, 255, 70, 0)');
    gradient.addColorStop(0.8, 'rgba(0, 255, 70, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 255, 70, 0.8)');
    ctx.fillStyle = gradient;
    ctx.font = '12px "Courier New", monospace';

    codeRain.forEach((drop, index) => {
    ctx.fillText(drop.character, drop.x, drop.y);
    drop.y += drop.speed;

    if (drop.y > canvas.height) {
        drop.y = 0;
        drop.character = String.fromCharCode(Math.random() * 128);
    }
    });

    requestAnimationFrame(animateCodeRain);
}

onMount(() => {
    setupCanvas();
    generateCodeRain();
    animateCodeRain();

    window.addEventListener('resize', setupCanvas);

    return () => {
    window.removeEventListener('resize', setupCanvas);
    };
});
</script>

<canvas 
bind:this={canvas} 
class="fixed top-0 left-0 z-[-1] opacity-30" 
/>

