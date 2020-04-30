import { app, BrowserWindow, ipcMain, globalShortcut, dialog } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import * as chokidar from 'chokidar';
import * as log from 'electron-log';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import Setting from './utail/Setting';
import FileManager from './utail/FileManager';
import Path from '../electron/utail/Path';
/* ---------------------------- import type interFace ---------------------------- */

import { OpenDialogReturnValue } from 'electron';

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
	/* -------------------------------- shortcuts ------------------------------- */
	globalShortcut.register('CommandOrControl+Shift+p', () => {
		contents.send('prompt:toggleDisplay');
	})
	contents.on('did-finish-load', () => {
		chokidar.watch(_path.getConfigFilePath(), { persistent: true, usePolling: true }).on('all', (event, path) => {
			// start and watch setting config file
			boot();
		});
	});
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

const boot = () => {
	const read_config_file = _setting.readSetting();
	read_config_file.then((configString: string) => {
		const config = JSON.parse(configString);
		const project_path = config.project_path;
		contents.send('files:project_path', project_path);
	});
}


ipcMain.on('files:select_project_path', (event: any) => {
	const select_dialog = dialog.showOpenDialog({
		properties: ['openDirectory']
	});
	select_dialog.then((selected_path: OpenDialogReturnValue) => {
		if (!selected_path.canceled) {
			const project_path: string | undefined = selected_path.filePaths.pop();
			const config: { key: string, value: string | undefined }[] = [
				{
					key: "project_path",
					value: project_path
				}
			]
			_setting.updateSetting(config);
			contents.send('files:project_path', project_path);
		}
	});
});

ipcMain.on('files:get_List', (_event: any, project_path: string) => {
	if (project_path !== '') {
		chokidar.watch(project_path, { persistent: true, usePolling: true }).on('all', (event: any, path: any) => {
			const list_dir: Promise<Array<string>> = _filemanager.getFIleAndFolders(project_path);
			list_dir.then((list: Array<string>) => {
				_event.sender.send('files:get_list@response', list);
			}).catch((err) => {
				log.error(err)
			});
		});
	}
});

