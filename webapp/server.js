import express from 'express'
import initBackendServer from '@pivoto-study/backend'
import { handler } from './build/handler.js'

await initBackendServer({ port: 5390 })

const app = express()

app.use(handler)
app.listen(5380, () => {
	console.log('[svelte] listening on port 5380')
})