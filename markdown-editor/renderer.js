const {remote, ipcRenderer} = require('electron')
const marked = require('marked')
const {gid, qs} = require('../js/helpers')

const mainProcess = remote.require('./main')
const currentWindow = remote.getCurrentWindow()

const btnNew = gid('btn-new')
const btnOpen = gid('btn-open')
const btnSave = gid('btn-save')
const btnRevert = gid('btn-revert')
const btnHTML = gid('btn-html')

const dataLeft = gid('data-left')
const dataRight = gid('data-right')

let filePath
let originalContent

const renderMarkdown = (markdown) => {
	dataRight.innerHTML = marked(markdown)
}

const updateEditedState = (isEdited) => {
	// The window content has been changed
	currentWindow.setDocumentEdited(isEdited)

	btnSave.disabled = !isEdited
	btnRevert.disabled = !isEdited

	let title = 'MarkedEditor'
	if (filePath) title = `${filePath} - ${title}`
	if (isEdited) title = `${title} (Edited)`
	currentWindow.setTitle(title)
}

btnNew.addEventListener('click', () => {
	mainProcess.createWindow()
})

btnOpen.addEventListener('click', () => {
	mainProcess.openFile(currentWindow)
})

btnSave.addEventListener('click', () => {
	mainProcess.saveFile(
		currentWindow,
		dataLeft.value,
		() => updateEditedState(false)
	)
})

dataLeft.addEventListener('keyup', (event) => {
	const newContent = event.target.value
	renderMarkdown(newContent)
	updateEditedState(newContent !== originalContent)
})

ipcRenderer.on('file-opened', (event, file, content) => {
	filePath = file
	originalContent = content
	dataLeft.value = content
	renderMarkdown(dataLeft.value)
})
