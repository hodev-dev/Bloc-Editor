import { app, BrowserWindow, ipcMain, globalShortcut, dialog, clipboard } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as isDev from 'electron-is-dev';
import * as log from 'electron-log';
import * as  request from "request";
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import Setting from './utail/Setting';
import FileManager from './utail/FileManager';
import Path from '../electron/utail/Path';
import chokidar = require('chokidar');
import cheerio = require('cheerio');
import glob = require("glob");
import fsx = require('fs-extra');
const { Menu, MenuItem } = require('electron')
const { chain } = require('stream-chain');
const { parser } = require('stream-json');
const { streamValues } = require('stream-json/streamers/StreamValues');


/* ---------------------------- import type interFace ---------------------------- */

import { EventEmitter } from 'events';
import { OpenDialogReturnValue } from 'electron';
import { FSWatcher } from 'chokidar';
import { rejects } from 'assert';

/* ---------------------------- global variables ---------------------------- */

let win: BrowserWindow | null | any = null;
let contents: null | any;
let _setting: Setting;
let _filemanager: FileManager;
let _path: Path;
let _setting_watcher: FSWatcher;
let _files_watcher: FSWatcher;

/* ------------------------------- main window ------------------------------- */

const createWindow = () => {
	const iconPath = path.join(__dirname, "../", "icons", "icon.png");
	console.log({ iconPath })
	win = new BrowserWindow({
		width: 1280,
		height: 760,
		icon: iconPath,
		webPreferences: {
			nodeIntegration: true,
			webSecurity: false
		}
	});
	// hide menu bar
	win.setMenuBarVisibility(false);

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
	const template = [
		{
			label: "Menu",
			submenu: [
				{
					label: "Reload",
					accelerator: "F5",
					click: (item: any, focusedWindow: any) => {
						if (focusedWindow) {
							if (focusedWindow.id === 1) {
								BrowserWindow.getAllWindows().forEach(win => {
									if (win.id > 1) win.close();
								});
							}
							focusedWindow.reload();
						}
					}
				},
				{
					label: "Toggle Dev Tools",
					accelerator: "F12",
					click: () => {
						win.webContents.toggleDevTools();
					}
				},
				{
					label: `open coommand prompt`,
					accelerator: 'CommandOrControl +p',
					click: () => contents.send('prompt:toggleDisplay')
				},
				{
					label: `add new component`,
					accelerator: 'CommandOrControl + i',
					click: () => contents.send('searchableList:toggleDisplay')
				},
				{
					label: `toggle sidebar`,
					accelerator: 'CommandOrControl + b',
					click: () => contents.send('files:toggleDisplay')
				},
			]
		}
	]
	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu)
	contents.on('did-finish-load', () => { });
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
		const setting = _setting.readSetting();
		setting.then((config: any) => {
			const parsed_config = JSON.parse(config);
			contents.send('files:get_path', parsed_config.project_path, parsed_config.theme);
			contents.removeAllListeners('files:get_path');
			if (_files_watcher !== undefined) {
				_files_watcher.close().then(() => console.log('file watcher closed'));
				_setting_watcher.close().then(() => console.log('setting watcher closed'));
			}
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

ipcMain.on('files:request_list', (event: any, project_path: any) => {
	if (project_path !== '') {
		if (_files_watcher !== undefined) {
			_files_watcher.close().then(() => console.log(' files watcher closed'));
		}
		_files_watcher = chokidar.watch(project_path, { persistent: true, usePolling: false, ignoreInitial: false, depth: 0, awaitWriteFinish: false });
		let run_count = 0;
		_files_watcher.on('all', (_event: any, _path: any) => {
			run_count++;
			if (run_count === 1) {
				const files = _filemanager.getFIleAndFolders(project_path);
				const list_with_meta: any = [];
				let item: any = {};
				files.then((list) => {
					list.map((foldername) => {
						item.title = foldername;
						const extention = path.extname(path.join(project_path, foldername));
						item.type = (extention === '.bloc') ? "F" : 'D';
						item.path = path.join(project_path, foldername);
						list_with_meta.push(item);
						item = {};
					});
					contents.send('files:request_list', list_with_meta);
					run_count = 0;
				});
			}
			contents.removeAllListeners('files:request_list');
		});
	}
});

ipcMain.on('prompt:create_folder', (event: any, _path: string) => {
	if (!fs.existsSync(_path)) {
		log.info({ _path })
		fs.mkdirSync(_path);
		contents.send('notification:push', [
			{
				type: "Success",
				messege: "Folder Created",
			}
		]);
	} else {
		log.info('folder exist')
		contents.send('notification:push', [
			{
				type: "Error",
				messege: "Folder Already Exists!",
			}
		]);
	}
	log.info({ _path });
});



ipcMain.on('files:read_file', (event: any, _path: any, render_index: number, items_per_page: number) => {
	const pipeline = chain([
		fs.createReadStream(_path),
		parser(),
		streamValues(),
		(data: any) => {
			const value = data.value;
			return value;
		}
	]);
	let counter = 0;
	let arr: any = [];
	pipeline.on('data', (data: any) => {
		counter++;
		// if (counter > render_index && counter < render_index + items_per_page) {
		arr.push(data);
		// }
	});
	pipeline.on('end', (data: any) => {
		console.log({ arr })
		contents.send('files:read_file', arr, counter)
	});
});

ipcMain.on('files:create_bloc', (event: any, _path: string, component_data: any) => {
	fs.access(_path, (err) => {
		if (!err) {
			contents.send('notification:push', [
				{
					type: "Error",
					messege: "BLoc File Already Exist With This Name!",
				}
			]);
		} else {
			fs.writeFile(_path, JSON.stringify(component_data), (err) => {
				if (err) {
					contents.send('notification:push', [
						{
							type: "Error",
							messege: "Can't Create Bloc File!",
						}
					]);
				}
				contents.send('notification:push', [
					{
						type: "Success",
						messege: "bloc file created",
					}
				]);
			});
		}
	});
});

ipcMain.on('files:save_bloc', (event: any, _path: string, component_data: any) => {
	fs.writeFile(_path, JSON.stringify(component_data), (err) => {
		if (err) {
			contents.send('notification:push', [
				{
					type: "Error",
					messege: "Can't Save File!",
				}
			]);
		}
		contents.send('notification:push', [
			{
				type: "Info",
				messege: "Bloc File Saved!",
			}
		]);
	});
});


ipcMain.on('files:import_media', (event: any, project_path: any, id: string) => {
	const select_path: Promise<OpenDialogReturnValue> = dialog.showOpenDialog(win, {
		properties: ['openFile']
	});
	select_path.then((dialog_data: OpenDialogReturnValue) => {
		if (dialog_data.canceled) {
			// on cancel
		} else {
			console.log('daialog reprot', dialog_data.filePaths[0])
			console.log('project_path', project_path)
			const file_name = path.basename(dialog_data.filePaths[0]);
			const store_images_path = path.join(project_path, "store", "images", file_name);
			try {
				fs.readFile(dialog_data.filePaths[0], function read(err, data) {
					if (err) {
						throw err;
					}
					const content = new Buffer(data).toString('base64');;
					contents.send('files:import_media_path', content, id);
				});
			} catch (err) {
				console.error(err)
			}
		}
	});
});



ipcMain.on('linkPreview:get_data', (event: any, href: string, id: string, project_path: string) => {
	request(
		{ uri: href },
		function (error, response, body) {
			if (!error) {
				const $ = cheerio.load(body)
				let link_data = {
					title: $('title').text(),
					canonical: $('canonical').text(),
					description: $('meta[name="description"]').attr('content'),
					alter_description: $('description').text(),
					// Get OG Values
					og_title: $('meta[property="og:title"]').attr('content'),
					og_url: $('meta[property="og:url"]').attr('content'),
					og_img: $('meta[property="og:image"]').attr('content'),
					og_type: $('meta[property="og:type"]').attr('content'),
					// Get Twitter Values
					twitter_site: $('meta[name="twitter:site"]').attr('content'),
					twitter_domain: $('meta[name="twitter:domain"]').attr('content'),
					twitter_img_src: $('meta[name="twitter:image:src"]').attr('content'),
					// Get Facebook Values
					fb_appid: $('meta[property="fb:app_id"]').attr('content'),
					fb_pages: $('meta[property="fb:pages"]').attr('content'),
				}
				console.log({ link_data })
				contents.send("linkPreview:get_data", link_data, id);
				contents.send('notification:push', [
					{
						type: "Success",
						messege: "Fetch Data Was Successfull!",
					}
				]);
			} else {
				contents.send('notification:push', [
					{
						type: "Error",
						messege: "Something Went Wrong!",
					}
				]);
				console.log("error of get", error);
			}
		}
	);
});

ipcMain.on('clipboard:add', (event: any, url: string) => {
	clipboard.writeText(url);
	contents.send('notification:push', [
		{
			type: "Success",
			messege: "Url Added to Cliboard",
		}
	]);
});

ipcMain.on('searchField:search', (event: any, search_string: string, project_path: string) => {
	glob(project_path + '/**/*' + ".bloc", {}, function (er, files) {
		let filter: any = [];
		if (!er) {
			filter = files.filter((file: string) => {
				if (file.indexOf(search_string + ".bloc") !== -1) {
					return file;
				}
			});
		} else {
			filter = [];
		}
		contents.send('searchField:search', filter);
	})
});


ipcMain.on('prompt:set_theme', (event: any, theme_name: string) => {
	let new_config = [
		{
			key: "theme",
			value: theme_name
		}
	];
	_setting.updateSetting(new_config);
});
