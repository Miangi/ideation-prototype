import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/kit/vite'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter()
	},

	onwarn: (warning, handler) => {
		if(warning.code === 'a11y-click-events-have-key-events')
			return

		if(warning.code === 'a11y-no-static-element-interactions')
			return

		handler(warning)
	}
};

export default config;
