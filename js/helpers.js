/* eslint unicorn/prefer-query-selector: 0 */
function gid(id, scope) {
	return (scope || document).getElementById(id)
}

function qs(selector, scope) {
	return (scope || document).querySelector(selector)
}

module.exports = {
	gid,
	qs
}
