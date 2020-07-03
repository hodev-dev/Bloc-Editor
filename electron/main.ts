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
import * as puppeteer from 'puppeteer';
import * as uuid from 'uuid';
import fse = require('fs-extra');
import glob = require("glob")



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
	win = new BrowserWindow({
		width: 1280,
		height: 760,
		webPreferences: {
			nodeIntegration: true,
			webSecurity: false

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
	globalShortcut.register('CommandOrControl+shift+p', () => {
		contents.send('prompt:toggleDisplay');
	})
	globalShortcut.register('CommandOrControl+shift+a', () => {
		contents.send('searchableList:toggleDisplay');
	});
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
		const setting = _setting.readSetting();
		setting.then((config: any) => {
			const parsed_config = JSON.parse(config);
			contents.send('files:get_path', parsed_config.project_path, parsed_config.theme);
			contents.removeAllListeners('files:get_path');
			if (_files_watcher !== undefined) {
				_files_watcher.close().then(() => console.log('closed'));
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
			const store_path = path.join(dialog_data.filePaths[0], "store");
			const store_images_path = path.join(dialog_data.filePaths[0], "store", "images");
			if (!fs.existsSync(store_path)) {
				fs.mkdirSync(store_path);
			}
			if (!fs.existsSync(store_images_path)) {
				fs.mkdirSync(store_images_path);
			}
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

ipcMain.on('files:read_file', (event: any, _path: any) => {
	fs.readFile(_path, { encoding: 'utf-8' }, (err, data) => {
		if (!err) {
			contents.send('files:read_file', data);
		} else {
			log.error(err);
		}
	});
});

ipcMain.on('files:create_bloc', (event: any, _path: string, component_data: any) => {
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


ipcMain.on('files:import_media', (event: any, project_path: any) => {
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
			fs.createReadStream(dialog_data.filePaths[0]).pipe(fs.createWriteStream(store_images_path));
			contents.send('files:import_media_path', path.join("file://", store_images_path));
		}
	});
});
const getChromiumExecPath = () => {
	return puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked');
}

const screenshot = async (href: string, project_path: string) => {
	console.log('start takign screenshot')
	const browser = await puppeteer.launch({
		headless: true,
		devtools: false,
		args: [
			'--window-size=1920,1080',
			'--no-sandbox',
			'--disable-setuid-sandbox'
		],
		executablePath: getChromiumExecPath(),
	});
	const page = await browser.newPage();
	const save_path = path.join(project_path, 'store', 'images', uuid.v1() + 'screenshot.jpeg');
	await page.goto(href, { waitUntil: "networkidle0", timeout: 60000 });
	await page.setViewport({ width: 1280, height: 720 });
	await page.screenshot({ path: save_path, type: "jpeg", fullPage: false });
	await browser.close();
	return save_path;
}

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
				const shot = screenshot(href, project_path);
				shot.then((image_path: string) => {
					console.log({ link_data })
					contents.send("linkPreview:get_data", link_data, id, image_path);
					contents.send('notification:push', [
						{
							type: "Success",
							messege: "Fetch Data Was Successfull!",
						}
					]);
				}).catch((err: any) => {
					console.error(err);
				});
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

const save_page = async (project_path: string, url: string) => {
	const browser = await puppeteer.launch({
		headless: false,
		devtools: false,
		defaultViewport: null,
		args: [
			'--window-size=1920,1080',
			'--start-fullscreen',
			'--no-sandbox',
			'--disable-setuid-sandbox'
		],
		executablePath: getChromiumExecPath(),
	});
	const [page] = await browser.pages();
	const saved_path = path.join(project_path, 'store', "offline_pages", uuid.v1() + '.mhtml');
	await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
	const cdp: any = await page.target().createCDPSession();
	const { data } = await cdp.send('Page.captureSnapshot', { format: 'mhtml' });
	fs.writeFileSync(saved_path, data);
	await browser.close();
	return saved_path;
}

ipcMain.on('linkPreview:save_offline', (event: any, project_path: string, url: string, id: string) => {
	const saved = save_page(project_path, url);
	saved.then((path: string) => {
		contents.send("linkPreview:save_offline", id, path);
	});
});

const open_page = async (path: string) => {
	const browser = await puppeteer.launch({
		headless: false,
		devtools: false,
		defaultViewport: null,
		args: [
			'--window-size=1920,1080',
			'--no-sandbox',
			'--disable-setuid-sandbox'
		],
		executablePath: getChromiumExecPath(),
	});
	const page = await browser.newPage();
	console.log({ path })
	await page.goto("file://" + path);
}
ipcMain.on('linkPreview:open_offline', (event: any, path: string, id: string) => {
	console.log('open offline')
	open_page(path);
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