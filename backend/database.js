import { open as openConnection } from '@structdb/mysql'
import schema from './schema.json' assert { type: 'json' }

export default () => {
	return openConnection({
		credentials: {
			host: 'study.pivoto.ai',
			user: 'pivoto',
			password: 'EQubNtDIwxYxmHtY',
			database: 'pivoto',
			poolSize: 5
		},
		schema
	})
}