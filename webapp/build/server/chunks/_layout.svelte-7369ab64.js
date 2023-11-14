import { c as create_ssr_component } from './ssr-123635f6.js';

const css = {
  code: "html,body{overflow:hidden}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${slots.default ? slots.default({}) : ``}`;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-7369ab64.js.map
