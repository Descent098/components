import { vitePreprocess } from '@astrojs/svelte';

export default {
	vitePlugin: {
    inspector: true
  },
	preprocess: vitePreprocess(),
	runes: true
}
