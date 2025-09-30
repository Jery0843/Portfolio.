import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter(),
        alias: {
            $lib: './src/lib'
        },
        prerender: {
            handleHttpError: ({ path, referrer, message }) => {
                if (message.includes('404')) {
                    return;
                }
                throw new Error(message);
            }
        }
    },
    preprocess: vitePreprocess()
};

export default config;
