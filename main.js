const { app, BrowserWindow } = require('electron')
try {
    require('electron-reloader')(module)
} catch (_) {}


function createWindow () {
    const win = new BrowserWindow({
        width: 560,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.setResizable(false)
    win.loadFile('./index.html')
    win.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
