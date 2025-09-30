<script lang="ts">
import type { TimelineEvent } from '$lib/data/portfolio-data';

export let event: TimelineEvent;
</script>

<div class="timeline-item mb-12">
<div class="timeline-content bg-black border border-green-500 p-6 rounded-lg">
    <h3 class="text-2xl font-mono mb-2">{event.title}</h3>
    <div class="text-green-300 mb-4">
    {#if event.company}
        <span class="mr-2">{event.company}</span>
    {/if}
    {#if event.location}
        <span class="text-gray-500">| {event.location}</span>
    {/if}
    </div>
    <div class="text-sm text-green-400 mb-4">{event.date}</div>
    
    <ul class="list-disc list-inside text-gray-400 mb-4">
    {#each event.description as point}
        <li class="mb-2">{point}</li>
    {/each}
    </ul>

    {#if event.technologies}
    <div class="flex flex-wrap gap-2 mt-4">
        {#each event.technologies as tech}
        <span class="px-3 py-1 text-xs bg-green-900 text-green-300 rounded-full">
            {tech}
        </span>
        {/each}
    </div>
    {/if}
</div>
</div>

<style>
.timeline-item {
    position: relative;
    width: 100%;
    padding-left: 50%;
}

.timeline-item::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background-color: rgb(34 197 94);
    border-radius: 50%;
    left: calc(50% - 10px);
    top: 20px;
    z-index: 1;
}

.timeline-content {
    position: relative;
    margin-left: 20px;
}

.timeline-content::before {
    content: '';
    position: absolute;
    left: -20px;
    top: 20px;
    width: 20px;
    height: 2px;
    background-color: rgb(34 197 94);
}
</style>

