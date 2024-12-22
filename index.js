const path = require('path');
const url = require('url');
const {app, BrowserWindow, session, Tray, Menu} = require('electron');

let win;

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (win) {
            if (win.isMinimized()) win.restore();
            if (!win.isVisible()) {
                win.show();
                win.focus();
            }
        }
    });

    // Create myWindow, load the rest of the app, etc...
    app.on('ready', () => {
    })
}

if (require('electron-squirrel-startup')) app.quit();

function createWindow() {
    win = new BrowserWindow({
        width: 1400,
        height: 900,
        icon: __dirname + "/media/icon_round.ico",
        autoHideMenuBar: true,
    });
    win.loadURL(url.format({
        pathname: path.join('bomes.ru'),
        protocol: 'https:',
        slashes: true
    }));

    win.on('close', (ev) => {
        if (win?.isVisible()) {
            ev.preventDefault();
            win.hide();
        }
    });
}

app.on('ready', (request, callback) => {
    session.defaultSession.cookies.get({})
        .then((cookies) => {

        }).catch((error) => {
        console.log(error)
    })

    session.defaultSession.cookies.get({ url: 'https://www.bomes.ru' })
        .then((cookies) => {

        }).catch((error) => {
        console.log(error)
    })

    const cookie = { url: 'https://www.bomes.ru', name: 'dummy_name', value: 'dummy' }
    session.defaultSession.cookies.set(cookie)
        .then(() => {

        }, (error) => {
            console.error(error)
        })

    createWindow();
});
let tray = null;
app.whenReady().then(() => {
    tray = new Tray(__dirname + "/media/icon_round.ico")
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Close'
        },
    ])
    contextMenu.items[0].click = () => {
        app.exit();
    }
    tray.setToolTip('Shortcutter')
    tray.setContextMenu(contextMenu)

    tray.on('click', () => {
        win.isVisible() ? win.hide() : win.show();
    });
});