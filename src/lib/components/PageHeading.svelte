<script lang="ts">
    let { index, title, description }: { index: string; title: string; description: string } = $props();
</script>
<header class="page-heading">
    <div class="eyebrow"><span class="status-dot"></span>0x{index} / PORTFOLIO DIRECTORY</div>
    <h1>{title}<span class="heading-dot">.</span></h1>
    <p>{description}</p>
</header>
