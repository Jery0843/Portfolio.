import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [sveltekit()],
    ssr: {
        noExternal: ['style-value-types', 'framesync']
    },
    server: {
        fs: {
            strict: false
        }
    },
    optimizeDeps: {
        include: ['@popmotion/popcorn']
    }
});
