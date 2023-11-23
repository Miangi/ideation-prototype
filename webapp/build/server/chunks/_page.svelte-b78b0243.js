import { c as create_ssr_component, v as validate_component, b as add_attribute } from './ssr-cfa1d793.js';
import { U as URlogo, W as Wave_fx } from './wave-fx-892272ff.js';
import { g as getCookies, a as goto } from './cookies-e2afa694.js';

async function get({ url, query, headers }){
	let queryString = new URLSearchParams(query).toString();
	let queryUrl = `${url}?${queryString}`;
	let res = await fetch(queryUrl, {
		headers: {
			'Accept': 'application/json',
			...headers
		}
	});
	
	return await parseResponse(res)
}


async function parseResponse(res){
	let text = await res.text();
	let data;

	try{
		data = JSON.parse(text);
	}catch{
		throw {
			message: text,
			status: res.status
		}
	}

	if(!res.ok){
		throw {
			...data,
			status: res.status
		}
	}

	return data
}

const css$1 = {
  code: ".code-input-container.svelte-1qvrpym.svelte-1qvrpym{display:flex;flex-direction:column;align-items:center;margin-top:5%}.code-input-container.svelte-1qvrpym .input-code.svelte-1qvrpym{display:flex;flex-direction:column;align-items:center}.code-input-container.svelte-1qvrpym .input-code .input-wrapper.svelte-1qvrpym{position:relative}.code-input-container.svelte-1qvrpym .input-code .input-wrapper .checking.svelte-1qvrpym{position:absolute;top:15px;right:0px}.code-input-container.svelte-1qvrpym .input-code input.svelte-1qvrpym{border:none;height:44px;width:380px;background-color:transparent;border-bottom:solid #CACACA;justify-content:center;outline:none;color:#FEFEFE;text-align:center;font-size:24px;font-family:inherit;font-weight:bold}.code-input-container.svelte-1qvrpym .input-code input.svelte-1qvrpym::placeholder{text-align:center;font-size:24px;font-weight:bold;color:#3E3E3E}.code-input-container.svelte-1qvrpym .input-surname.svelte-1qvrpym{display:flex;flex-direction:column;align-items:center}.code-input-container.svelte-1qvrpym .input-surname .surname-container.svelte-1qvrpym{display:flex;align-items:center;gap:5px}.code-input-container.svelte-1qvrpym .input-surname .back-icon.svelte-1qvrpym{display:flex;margin-top:-15px;cursor:pointer}.code-input-container.svelte-1qvrpym .input-surname input.svelte-1qvrpym{border:none;height:44px;width:380px;background-color:transparent;border-bottom:solid #CACACA;justify-content:center;outline:none;color:#FEFEFE;text-align:center;font-size:24px;font-family:inherit;font-weight:bold}.code-input-container.svelte-1qvrpym .input-surname input.svelte-1qvrpym::placeholder{text-align:center;font-size:24px;font-weight:bold;color:#3E3E3E}.code-input-container.svelte-1qvrpym .input-name.svelte-1qvrpym{display:flex;flex-direction:column;align-items:center}.code-input-container.svelte-1qvrpym .input-name .name-container.svelte-1qvrpym{display:flex;align-items:center;gap:5px}.code-input-container.svelte-1qvrpym .input-name .back-icon.svelte-1qvrpym{display:flex;margin-top:-15px;cursor:pointer}.code-input-container.svelte-1qvrpym .input-name input.svelte-1qvrpym{border:none;height:44px;width:380px;background-color:transparent;border-bottom:solid #CACACA;justify-content:center;outline:none;color:#FEFEFE;text-align:center;font-size:24px;font-family:inherit;font-weight:bold}.code-input-container.svelte-1qvrpym .input-name input.svelte-1qvrpym::placeholder{text-align:center;font-size:24px;font-weight:bold;color:#3E3E3E}.code-input-container.svelte-1qvrpym .input-mail.svelte-1qvrpym{display:flex;flex-direction:column;align-items:center}.code-input-container.svelte-1qvrpym .input-mail .mail-container.svelte-1qvrpym{display:flex;align-items:center;gap:5px}.code-input-container.svelte-1qvrpym .input-mail .back-mail-icon.svelte-1qvrpym{display:flex;margin-top:-85px;cursor:pointer}.code-input-container.svelte-1qvrpym .input-mail input.svelte-1qvrpym{border:none;height:44px;width:380px;background-color:transparent;border-bottom:solid #CACACA;justify-content:center;outline:none;color:#FEFEFE;text-align:center;font-size:24px;font-family:inherit;font-weight:bold}.code-input-container.svelte-1qvrpym .input-mail input.svelte-1qvrpym::placeholder{text-align:center;font-size:24px;font-weight:bold;color:#3E3E3E}.code-input-container.svelte-1qvrpym .instruction.svelte-1qvrpym{display:flex;margin-top:10px;color:#959595;width:100%;justify-content:center}.code-input-container.svelte-1qvrpym .start-button-container.svelte-1qvrpym{display:flex;margin-top:10px;color:#959595;width:100%;justify-content:center;position:relative}.code-input-container.svelte-1qvrpym .start-button-container .start-button.svelte-1qvrpym{display:flex;margin-top:15px;width:100%;height:44px;align-items:center;color:#959595;justify-content:center;background-color:rgba(8, 58, 43, 0.5019607843);color:#34E5B0;border-radius:10px;cursor:pointer}.code-input-container.svelte-1qvrpym .start-button-container .start-button.disabled.svelte-1qvrpym{pointer-events:none;background-color:#2b2b2b;color:#575757}.code-input-container.svelte-1qvrpym .start-button-container .registering.svelte-1qvrpym{position:absolute;top:27px;right:0px}.code-input-container.svelte-1qvrpym .error.svelte-1qvrpym{display:flex;align-items:center;color:#FF7878;margin-top:5px}",
  map: null
};
const Inputs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let registrationCode = "";
  $$result.css.add(css$1);
  registrationCode = registrationCode.toUpperCase();
  return `<div class="code-input-container svelte-1qvrpym">${`<div class="input-code svelte-1qvrpym"><div class="input-wrapper svelte-1qvrpym"><input type="text" id="registration-code" placeholder="Your Registration Code" ${""} maxlength="5" class="svelte-1qvrpym"${add_attribute("value", registrationCode, 0)}> ${``}</div> <div class="instruction svelte-1qvrpym" data-svelte-h="svelte-ennphq">Once we start, please enter your registration code</div> ${``}</div>`} ${``} ${``} ${``} </div>`;
});
const css = {
  code: ".landing-container.svelte-vob2zq.svelte-vob2zq{display:flex;flex-direction:column;width:100%;height:100%;z-index:10;position:relative}.logo-UR.svelte-vob2zq.svelte-vob2zq{display:flex;width:auto;margin-left:auto;margin-right:25px;margin-top:25px}.welcome-message.svelte-vob2zq.svelte-vob2zq{display:flex;flex-direction:column;align-items:center;margin-top:10%;gap:5px;color:#34E5B0}.welcome-message.svelte-vob2zq .label.svelte-vob2zq{font-size:36px;font-weight:bold}.wave-fx.svelte-vob2zq.svelte-vob2zq{position:absolute;left:0;right:0;bottom:calc(20vh - 250px);height:400px;overflow:hidden;z-index:1}",
  map: null
};
const Landing_page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  async function checkToken() {
    let token = getCookies().token;
    let { valid } = await get({
      url: `${"https://study.pivoto.ai/api"}/check-token`,
      query: { token }
    });
    if (valid)
      goto("/ideation");
    else {
      document.cookie = `token=; path=/;`;
      window.localStorage.clear();
    }
  }
  checkToken();
  $$result.css.add(css);
  return `<div class="landing-container svelte-vob2zq"><div class="logo-UR svelte-vob2zq">${validate_component(URlogo, "URlogo").$$render($$result, {}, {}, {})}</div> <div class="welcome-message svelte-vob2zq" data-svelte-h="svelte-w18pnb"><div class="label svelte-vob2zq">Welcome to the study</div> <div class="subtext">You will be brainstorming with AI</div></div> ${validate_component(Inputs, "InputForm").$$render($$result, {}, {}, {})}</div> <div class="wave-fx svelte-vob2zq">${validate_component(Wave_fx, "WaveFx").$$render($$result, {}, {}, {})} </div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Landing_page, "LandingPage").$$render($$result, {}, {}, {})}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-b78b0243.js.map
