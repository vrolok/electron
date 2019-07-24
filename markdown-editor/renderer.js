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

const renderMarkdown = (markdown) => {
	dataRight.innerHTML = marked(markdown)
}

const updateEditedState = (isEdited) => {
	currentWindow.setDocumentEdited(isEdited)

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

dataLeft.addEventListener('keyup', (event) => {
	renderMarkdown(event.target.value)
	// Specifies whether the window’s document has been edited
	updateEditedState(true)
})

ipcRenderer.on('file-opened', (event, file, data) => {
	filePath = file
	dataLeft.value = data
	renderMarkdown(dataLeft.value)
})
