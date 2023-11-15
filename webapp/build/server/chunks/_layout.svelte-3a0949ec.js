import { c as create_ssr_component } from './ssr-cfa1d793.js';

const css = {
  code: "html,body{overflow:hidden}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${slots.default ? slots.default({}) : ``}`;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-3a0949ec.js.map
