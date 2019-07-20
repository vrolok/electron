const {qs, gid} = require('./helpers.js')

const input = gid('url-input')
const submit = gid('url-submit')
const list = gid('link-list')

function appendToList({title, url}) {
	const template = gid('link-template')
	const clone = document.importNode(template.content, true)

	const a = qs('a', clone)
	const image = qs('img', clone)

	a.textContent = title
	a.setAttribute('href', url)
	image.setAttribute('src', url + '/favicon.ico')

	list.append(clone)
}

input.addEventListener('keyup', function $$inputValidate() {
	submit.disabled = !input.checkValidity()
})

submit.addEventListener('click', function $$submitClicked(e) {
	e.preventDefault()

	const parser = new DOMParser()
	const parseResponse = text => parser.parseFromString(text, 'text/html')

	fetch(input.value)
		.then(resonse => resonse.text())
		.then(text => parseResponse(text))
		.then(html => qs('title', html).textContent)
		.then(title => appendToList({title, url: input.value}))
		.catch(error => console.warn(error))
})
