const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon-16x16.png","favicon-32x32.png","favicon.ico","favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.789134f3.js","app":"_app/immutable/entry/app.84694573.js","imports":["_app/immutable/entry/start.789134f3.js","_app/immutable/chunks/scheduler.2aec043e.js","_app/immutable/chunks/singletons.ff1d4463.js","_app/immutable/entry/app.84694573.js","_app/immutable/chunks/scheduler.2aec043e.js","_app/immutable/chunks/index.bc40a9dc.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./chunks/0-63dbd9d6.js')),
			__memo(() => import('./chunks/1-6414681c.js')),
			__memo(() => import('./chunks/2-db059b27.js')),
			__memo(() => import('./chunks/3-da134201.js')),
			__memo(() => import('./chunks/4-2a4c034b.js')),
			__memo(() => import('./chunks/5-3d80727f.js')),
			__memo(() => import('./chunks/6-dcb6d143.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/ideation",
				pattern: /^\/ideation\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/thank-you",
				pattern: /^\/thank-you\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 6 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();

const prerendered = new Set([]);

export { manifest, prerendered };
//# sourceMappingURL=manifest.js.map
