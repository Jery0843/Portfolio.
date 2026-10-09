<script lang="ts">
import { personalInfo } from '$lib/data/portfolio-data';
</script>

<footer class="bg-black/50 backdrop-blur-sm mt-20 py-8">
    <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="text-green-400 font-mono mb-4 md:mb-0">
                <p class="text-lg">[{personalInfo.name}]</p>
                <p class="text-sm">{personalInfo.email}</p>
            </div>
            <div class="text-green-300 font-mono text-sm">
                <p>Location: {personalInfo.location}</p>
                <p>© {new Date().getFullYear()} All rights reserved</p>
            </div>
        </div>
    </div>
</footer>

