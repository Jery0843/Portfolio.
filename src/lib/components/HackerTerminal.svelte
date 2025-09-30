<script lang="ts">
import { onMount } from 'svelte';
import { fly } from 'svelte/transition';

export let lines: string[] = [];
export let typingSpeed = 35;
export let showCursor = true;
let currentLineIndex = 0;
let displayedLines = [];

function typeLines() {
    if (currentLineIndex < lines.length) {
    const line = lines[currentLineIndex];
    displayedLines = [...displayedLines, ''];
    let charIndex = 0;

    function typeChar() {
        if (charIndex < line.length) {
        displayedLines[currentLineIndex] += line[charIndex];
        charIndex++;
        setTimeout(typeChar, typingSpeed);
        } else {
        currentLineIndex++;
        typeLines();
        }
    }

    typeChar();
    }
}

$: lines, typeLines();
</script>

<div class="bg-black/90 p-6 rounded-lg border border-green-500/30 shadow-lg shadow-green-500/20 
            terminal-container overflow-hidden relative"
    in:fly={{ y: 50, duration: 800 }}
>
    <div class="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-green-500/10 to-transparent"></div>
    {#each displayedLines as line, index}
        <div 
            class="text-green-400 font-mono tracking-wide terminal-text text-xl
                {index === displayedLines.length - 1 ? 'typing-line' : ''}"
            in:fly={{ y: 20, duration: 400 }}
        >
            <span class="text-green-600 mr-2">$</span>
            {line}
            {#if showCursor && index === displayedLines.length - 1}
                <span class="cursor">█</span>
            {/if}
        </div>
    {/each}
    <div class="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-green-500/10 to-transparent"></div>
</div>

