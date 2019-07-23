const {remote, ipcRenderer} = require('electron')
const marked = require('marked')
const {gid, qs} = require('../js/helpers')

const mainProcess = remote.require('./main')

const btnNew = gid('btn-new')
const btnOpen = gid('btn-open')
const btnSave = gid('btn-save')
const btnRevert = gid('btn-revert')
const btnHTML = gid('btn-html')

const dataLeft = gid('data-left')
const dataRight = gid('data-right')

const renderMarkdown = markdown => {
	dataRight.innerHTML = marked(markdown)
}

btnOpen.addEventListener('click', () => {
	mainProcess.openFile()
})

dataLeft.addEventListener('keyup', event => {
	renderMarkdown(event.target.value)
})

ipcRenderer.on('file-opened', (event, file, data) => {
	dataLeft.value = data
	renderMarkdown(dataLeft.value)
})
