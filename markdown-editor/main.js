// Modules to control application life and create native browser window
const {app, BrowserWindow, dialog} = require('electron')
const fs = require('fs')

const newWindows = new Set()

function createWindow() {
	// Create the browser window.
	let newWindow = new BrowserWindow({
		width: 800,
		height: 800,
		title: 'MarkedEditor',
		webPreferences: {
			// Enables node in renderer
			nodeIntegration: true
		}
	})

	// And load the index.html of the app.
	newWindow.loadFile('index.html')

	// Open the DevTools.
	// newWindow.webContents.openDevTools()

	// Emmited when a user attempts to close the window
	newWindow.on('close', (event) => {
		if (newWindow.isDocumentEdited()) {
			event.preventDefault()
			dialog.showMessageBox(newWindow, {
				type: 'warning',
				buttons: ['Cancel', 'Save', 'Don\'t save'],
				defaultId: 1,
				cancelId: 0,
				title: 'Save changes',
				detail: 'Would you like to save changes to the document?'
			}, (response) => {
				if (response === 2) newWindow.destroy()
				// todo: save
			})
		}
	})

	// Emitted when the window is closed.
	newWindow.on('closed', () => {
		newWindow = null
		newWindows.delete(newWindow)
	})

	// Add window to a set of windows
	newWindows.add(newWindow)
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') app.quit()
})

//app.on('activate', () => {
//	// On macOS it's common to re-create a window in the app when the
//	// dock icon is clicked and there are no other windows open.
//	if (newWindow === null) {
//		createWindow()
//	}
//})

const openFileDialog = (targetWindow) => {
	const file = dialog.showOpenDialog(targetWindow, {
		title: 'Select a markdown file',
		filters: [
			{name: 'Files', extensions: ['txt', 'md']}
		],
		properties: ['openFile']
	})

	if (!file) return

	return file[0]
}

const openFile = (targetWindow) => {
	const file = openFileDialog(targetWindow)
	fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
		if (err) return

		targetWindow.webContents.send('file-opened', file, data)
		targetWindow.setTitle(`${file} - MarkedEditor`)
		targetWindow.setRepresentedFilename(file)
	})
}

module.exports = {
	openFile,
	createWindow
}
