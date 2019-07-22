// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')

let mainWindow

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 400,
		height: 600,
		webPreferences: {
			// Enables node in renderer
			nodeIntegration: true
		}
	})

	// And load the index.html of the app.
	mainWindow.loadFile('index.html')

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()

	// Emitted when the window is closed.
	mainWindow.on('closed', () => {
		mainWindow = null
	})
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow()
	}
})
