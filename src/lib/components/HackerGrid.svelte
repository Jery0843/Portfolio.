<script lang="ts">
export let gridItems: { title: string, description: string, icon?: string }[] = [];
export let columns: number = 3;
</script>

<div 
class="grid gap-4 p-6 bg-gray-900 bg-opacity-80 rounded-lg"
style="grid-template-columns: repeat({columns}, 1fr);"
>
{#each gridItems as item}
    <div 
    class="
        bg-gray-800 border border-green-500 
        p-4 rounded-lg transition-all 
        hover:bg-green-900 hover:border-green-400 
        hover:scale-105 cursor-pointer
    "
    >
    {#if item.icon}
        <div class="text-2xl text-green-400 mb-2">{item.icon}</div>
    {/if}
    <h3 class="text-green-300 font-bold mb-2">{item.title}</h3>
    <p class="text-gray-300 text-sm">{item.description}</p>
    </div>
{/each}
</div>

