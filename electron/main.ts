import { app, BrowserWindow, ipcMain, globalShortcut, dialog } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import * as log from 'electron-log';
import Setting from './utail/Setting';
import FileManager from './utail/FileManager';
import { PROJECT_PATH } from './constants/settingKeys';
import Path from '../electron/utail/Path';

/* ---------------------------- global variables ---------------------------- */

let win: BrowserWindow | null | any = null;
let contents: null | any;
let _setting: Setting;
let _filemanager: FileManager;
let _path: Path;

/* ------------------------------- main window ------------------------------- */

const createWindow = () => {
	win = new BrowserWindow({
		width: 1280,
		height: 760,
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
	//   DevTools
	installExtension(REACT_DEVELOPER_TOOLS)
		.then((name) => console.log(`Added Extension:  ${name}`))
		.catch((err) => console.log('An error occurred: ', err));

	if (isDev) {
		win.webContents.openDevTools();
	}
}

app.on('ready', () => {
	createWindow();
	contents = win.webContents;
	_setting = new Setting();
	_filemanager = new FileManager();
	_path = new Path();
	_setting.initSetting();
	globalShortcut.register('CommandOrControl+Shift+p', () => {
		contents.send('prompt:toggleDisplay');
	})
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

/* -------------------------------- explorer functions ------------------------------- */

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

/* --------------------------------- explorer events --------------------------------- */

ipcMain.on('explorer:getProjectPath', (event) => {
	setProjectPath(event, 'local');
});

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
	log.info('test4');
	if (data.projectPath !== '' && data.projectPath !== undefined) {
		if (data.projectPath !== '' && data.projectPath !== undefined) {
			const normal = [_path.normilizePath(data.projectPath)];
			const fullpath = path.join.apply(null, normal.concat(data.stackFolder));
			updateExplorerList(event, { 'projectPath': data.projectPath, 'folderName': data.folderName, 'fullPath': fullpath });
		}
	}
});