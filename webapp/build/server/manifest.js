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
		client: {"start":"_app/immutable/entry/start.024aef4e.js","app":"_app/immutable/entry/app.6a1aa15d.js","imports":["_app/immutable/entry/start.024aef4e.js","_app/immutable/chunks/scheduler.c04ecb7b.js","_app/immutable/chunks/singletons.83e23967.js","_app/immutable/entry/app.6a1aa15d.js","_app/immutable/chunks/scheduler.c04ecb7b.js","_app/immutable/chunks/index.01e091ee.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./chunks/0-20df8a93.js')),
			__memo(() => import('./chunks/1-039c8696.js')),
			__memo(() => import('./chunks/2-43dd7fb0.js')),
			__memo(() => import('./chunks/3-5d570dbc.js')),
			__memo(() => import('./chunks/4-576fce91.js')),
			__memo(() => import('./chunks/5-825d5b6d.js')),
			__memo(() => import('./chunks/6-519c25f0.js'))
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
