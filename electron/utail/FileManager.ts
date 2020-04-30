import Setting from './Setting';
import { PROJECT_PATH } from '../constants/settingKeys';
import log from 'electron-log';
import * as fs from 'fs';
import * as path from 'path';

class FileManager {
    setting: Setting;
    constructor() {
        this.setting = new Setting();
    }
    getFIleAndFolders(path: string): Promise<Array<string>> {
        return new Promise((resolve, reject) => {
            fs.readdir(path, (err: any, files: Array<string>) => {
                if (!err) {
                    resolve(files);
                } else {
                    reject(err);
                }
            });
        });
    }
    changeFolder(currentFolderPath: string, name: string) {
        const newPath = path.join(currentFolderPath, name);
        return newPath;
    }
}

export default FileManager;