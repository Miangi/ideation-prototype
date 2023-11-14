import { fork } from 'child_process'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'
import chokidar from 'chokidar'

export default defineConfig(({ mode }) => ({
	plugins: [
		sveltekit(),
		{
			name: 'backendServer',
			configureServer(server){
				let serverProcess
				let timer

				async function reload(){
					if(serverProcess) 
						serverProcess.kill()

					serverProcess = fork('./devserver.js')
				}
				
				reload()
				chokidar.watch('../backend').on('all', () => {
					clearTimeout(timer)
					timer = setTimeout(reload, 500)
				})
			}
		}
	],
	define: {
		BACKEND_SOCKET_URL: mode === 'production'
			? '"wss://study.pivoto.ai/api"'
			: '"ws://localhost:8080"',
		BACKEND_REST_URL: mode === 'production'
			? '"https://study.pivoto.ai/api"'
			: '"http://localhost:8080"'
	}
}));
