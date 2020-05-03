import { app, BrowserWindow, ipcMain, globalShortcut, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as isDev from 'electron-is-dev';
import * as chokidar from 'chokidar';
import * as log from 'electron-log';
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import Setting from './utail/Setting';
import FileManager from './utail/FileManager';
import Path from '../electron/utail/Path';
/* ---------------------------- import type interFace ---------------------------- */

import { OpenDialogReturnValue } from 'electron';
import { FSWatcher } from 'chokidar';
import { rejects } from 'assert';

/* ---------------------------- global variables ---------------------------- */

let win: BrowserWindow | null | any = null;
let contents: null | any;
let _setting: Setting;
let _filemanager: FileManager;
let _path: Path;
let _chikodar: any;
let _setting_watcher: any;
let _files_watcher: any;

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
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
	_setting_watcher.close().then(() => console.log('setting watcher closed'));
	_files_watcher.close().then(() => console.log('files watcher closed'));
	_setting_watcher.unwatch(_path.getConfigFilePath());
});

app.on('activate', () => {
	if (win === null) {
		createWindow();
	}
});

ipcMain.on('files:get_path', () => {
	_setting_watcher = chokidar.watch(_path.getConfigFilePath(), { usePolling: true });
	_setting_watcher.on('all', (event: any, path: any) => {
		log.info(event, path);
		const setting = _setting.readSetting();
		setting.then((config: any) => {
			const parsed_config = JSON.parse(config);
			contents.send('files:get_path', parsed_config.project_path);
		});
	});
});

ipcMain.on('files:select_path', () => {
	const project_path: Promise<OpenDialogReturnValue> = dialog.showOpenDialog(win, {
		properties: ['openDirectory']
	});
	project_path.then((dialog_data: OpenDialogReturnValue) => {
		if (dialog_data.canceled) {
			// on cancel
		} else {
			let new_config = [
				{
					key: "project_path",
					value: dialog_data.filePaths[0]
				}
			];
			const update = _setting.updateSetting(new_config);
		}
	});
});

ipcMain.on('files:request_list_once', (event: any, project_path: any) => {
	if (project_path !== '') {
		_files_watcher = chokidar.watch(project_path, { usePolling: true, ignoreInitial: false, depth: 0 });
		_files_watcher.on('ready', () => {
			log.info('ready')
			const files = _filemanager.getFIleAndFolders(project_path);
			files.then((list) => {
				contents.send('files:request_list', list);
			});
		});
	}
});

ipcMain.on('files:request_list', (event: any, project_path: any) => {
	if (project_path !== '') {
		let run_count = 0;
		_files_watcher = chokidar.watch(project_path, { usePolling: true, ignoreInitial: false, depth: 0, awaitWriteFinish: true });
		_files_watcher.on('all', (path: any) => {
			run_count++;
			if (run_count === 1) {
				log.info(path)
				const files = _filemanager.getFIleAndFolders(project_path);
				files.then((list) => {
					contents.send('files:request_list', list);
					run_count = 0;
				});
			}
		});
	}
});
