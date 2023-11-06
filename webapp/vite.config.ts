import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import initBackendServer from '@pivoto-study/backend'
import chokidar from 'chokidar'

export default defineConfig(({ mode }) => ({
	plugins: [
		sveltekit(),
		{
			name: 'backendServer',
			configureServer(server){
				if(mode === 'production'){
					initBackendServer({ port: 5390 })
				}else{
					let shutdown

					function reload(){
						if(shutdown) shutdown()
						shutdown = initBackendServer({ port: 8080 })
					}
					
					reload()
					chokidar.watch('../backend').on('all', reload)
				}
				
			}
		}
	],
	define: {
		BACKEND_SERVER_URL: mode === 'production'
			? '"wss://study.pivoto.ai/api"'
			: '"ws://localhost:8080"'
	}
}));
