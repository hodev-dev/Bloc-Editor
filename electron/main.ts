import { app, BrowserWindow, ipcMain,  } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import log from 'electron-log';
import { dialog } from 'electron';
import Setting from './utail/Setting';
import FileManager from './utail/FileManager';
import { PROJECT_PATH } from './constants/settingKeys';
import Path from '../electron/utail/Path';

let win: BrowserWindow | null | any = null;
let _setting: Setting;
let _filemanager: FileManager;
let _path: Path;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  if (isDev) {
    win.loadURL('http://localhost:3000/index.html');
  } else {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
  }

  win.on('closed', () => win = null);

  // Hot Reloading
  if (isDev) {
    // 'node_modules/.bin/electronPath'
    require('electron-reload')(__dirname, {
      electron: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
      forceHardReset: true,
      hardResetMethod: 'exit'
    });
  }

  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));

  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});


app.on('ready', () => {
    createWindow();
    _setting = new Setting();
    _filemanager = new FileManager();
    _path = new Path();
    _setting.initSetting();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

const setProjectPath = (event: any, projectPath: any) => {
    _setting.readSetting().then((data: string) => {
        let _projectPath;
        if (projectPath === 'local') {
            _projectPath = _setting.getSettingByKey(data, PROJECT_PATH);
        } else {
            _projectPath = projectPath;
        }
        event.sender.send('explorer:setProjectPath', _projectPath);
    });
}

/* -------------------- set project patch base on setting ------------------- */
ipcMain.on('explorer:getProjectPath', (event) => {
    // local for reading from setting
    setProjectPath(event, 'local');
});

/* ------------- set project patch base on selected file dialog ------------- */
ipcMain.on('explorer:selectProjectFolderPath', (event) => {
    const projectPath = dialog.showOpenDialogSync(win, {
        properties: ['openDirectory']
    });
    let path;
    if (projectPath !== undefined && projectPath.length > 0) {
        path = projectPath[0];
    }
    const config = [
        {
            key: "root-folder",
            value: path,
        },
        {
            key: "project-path",
            value: path,
        },
    ];
    _setting.updateSetting(config);
    setProjectPath(event, path);
});

const updateExplorerList = (event: any, data: any) => {
    const read = _filemanager.getFIleAndFolders(data.fullPath);
    const explorer: any = [];
    let item: any = {};
    read.then((files: any) => {
        files.forEach((file: any) => {
            const extention = path.extname(path.join(data.fullPath, file));
            item.title = file;
            if (extention !== '') {
                item.type = "F";
            } else {
                item.type = "D";
            }
            item.sub = {};
            explorer.push(item);
            item = {};
        });
        event.sender.send('explorer:updateList@response', explorer, null);
    }).catch((err) => {
        event.sender.send('explorer:updateList@response', explorer, err);
    });
}

/* --------------------- return list of File and Folders -------------------- */
ipcMain.on('explorer:updateList', (event, data) => {
    if (data) {
        if (data.projectPath !== '' && data.projectPath !== undefined) {
            updateExplorerList(event, data);
        }
    }
});

ipcMain.on('explorer:changeFolderAndUpdateList', (event, data) => {
    if (data.projectPath !== '' && data.projectPath !== undefined) {
        const normal = [_path.normilizePath(data.projectPath)];
        const fullpath = path.join.apply(null, normal.concat(data.stackFolder));
        updateExplorerList(event, { 'projectPath': data.projectPath, 'folderName': data.folderName, 'fullPath': fullpath });
    }
});

ipcMain.on('explorer:changeFolderBackAndUpdateList', (event, data) => {
    if (data.projectPath !== '' && data.projectPath !== undefined) {
        if (data.projectPath !== '' && data.projectPath !== undefined) {
            const normal = [_path.normilizePath(data.projectPath)];
            const fullpath = path.join.apply(null, normal.concat(data.stackFolder));
            updateExplorerList(event, { 'projectPath': data.projectPath, 'folderName': data.folderName, 'fullPath': fullpath });
        }
    }
});