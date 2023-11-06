import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import initBackendServer from '@pivoto/backend'

export default defineConfig(({ mode }) => ({
	plugins: [
		sveltekit(),
		{
			name: 'backendServer',
			configureServer(server){
				initBackendServer({
					port: mode === 'production'
						? 5390
						: 8080
				})
			}
		}
	],
	define: {
		BACKEND_SERVER_URL: mode === 'production'
			? '"wss://study.pivoto.ai/api"'
			: '"ws://localhost:8080"'
	}
}));
