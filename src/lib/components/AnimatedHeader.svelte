<script lang="ts">
import { fade, fly } from 'svelte/transition';
import { onMount } from 'svelte';

export let text = '';
export let speed = 50;
let displayText = '';
let cursor = true;

onMount(() => {
    let i = 0;
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            displayText += text[i];
            i++;
        } else {
            clearInterval(typeInterval);
        }
    }, speed);

    const cursorInterval = setInterval(() => {
        cursor = !cursor;
    }, 500);

    return () => {
        clearInterval(typeInterval);
        clearInterval(cursorInterval);
    };
});
</script>

<div class="font-mono text-green-400 text-xl relative" 
    in:fly={{ y: 20, duration: 400 }}>
    <span class="text-glow">{displayText}</span>
    {#if cursor}
        <span class="cursor-blink" 
            in:fade={{ duration: 200 }}
            out:fade={{ duration: 200 }}>█</span>
    {/if}
</div>

<style>
    .text-glow {
        text-shadow: 0 0 10px rgba(0, 255, 0, 0.7);
    }

    .cursor-blink {
        animation: blink 1s step-end infinite;
    }

    @keyframes blink {
        50% { opacity: 0; }
    }
</style>
