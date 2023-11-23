const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon-16x16.png","favicon-32x32.png","favicon.ico"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.90545d61.js","app":"_app/immutable/entry/app.586811f6.js","imports":["_app/immutable/entry/start.90545d61.js","_app/immutable/chunks/scheduler.2aec043e.js","_app/immutable/chunks/singletons.b5b2dd29.js","_app/immutable/entry/app.586811f6.js","_app/immutable/chunks/scheduler.2aec043e.js","_app/immutable/chunks/index.d7f47cb1.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./chunks/0-96144cd2.js')),
			__memo(() => import('./chunks/1-d63f8efa.js')),
			__memo(() => import('./chunks/2-f4b853cb.js')),
			__memo(() => import('./chunks/3-741f3d78.js')),
			__memo(() => import('./chunks/4-71044cf8.js')),
			__memo(() => import('./chunks/5-f5c79221.js')),
			__memo(() => import('./chunks/6-71b89666.js'))
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
