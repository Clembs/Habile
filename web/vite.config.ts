import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import entryShakingPlugin from 'vite-plugin-entry-shaking';

export default defineConfig({
	plugins: [
		sveltekit(),
		await entryShakingPlugin({
			targets: ['@tabler/icons-svelte'],
			extensions: ['svelte']
		})
	]
});
