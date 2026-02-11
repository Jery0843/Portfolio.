<script lang="ts">
    interface Props {
        code?: string;
        language?: string;
        lineNumbers?: boolean;
    }

    let { code = '', language = 'typescript', lineNumbers = true }: Props = $props();
</script>

<div class="bg-gray-900 text-green-400 font-mono p-4 rounded-lg overflow-x-auto text-xs tracking-tight">
{#if lineNumbers}
    <pre class="line-numbers">{#each code.split('\n') as line, i}
    <code class="block">
        <span class="text-gray-500 mr-4">{i + 1}│</span>{line}
    </code>
    {/each}</pre>
{:else}
    <pre><code>{code}</code></pre>
{/if}
</div>

<style>
.line-numbers {
    counter-reset: line;
}
</style>

