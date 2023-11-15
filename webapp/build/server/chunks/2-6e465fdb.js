const ssr = false;

var _layout_server = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ssr: ssr
});

const index = 2;
let component_cache;
const component = async () => component_cache ??= (await import('./_layout.svelte-71da1a52.js')).default;
const server_id = "src/routes/ideation/+layout.server.js";
const imports = ["_app/immutable/nodes/2.5f32b6ba.js","_app/immutable/chunks/scheduler.c04ecb7b.js","_app/immutable/chunks/index.7f978091.js"];
const stylesheets = ["_app/immutable/assets/fonts.0114dcb1.css"];
const fonts = ["_app/immutable/assets/Ubuntu-R.64349abe.woff","_app/immutable/assets/Ubuntu-RI.e6e1e09b.woff","_app/immutable/assets/Ubuntu-L.452fc387.woff","_app/immutable/assets/Ubuntu-M.7940b824.woff","_app/immutable/assets/Ubuntu-B.036e6322.woff"];

export { component, fonts, imports, index, _layout_server as server, server_id, stylesheets };
//# sourceMappingURL=2-6e465fdb.js.map
