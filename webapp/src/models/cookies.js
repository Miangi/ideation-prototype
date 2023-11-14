export function getCookies(){
	return Object.fromEntries(
		new URLSearchParams(
			document.cookie.replace(/; /g, "&")
		)
	)
}