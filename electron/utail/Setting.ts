import * as fs from 'fs';
import Path from './Path';
import log from 'electron-log';
import { PROJECT_PATH } from '../constants/settingKeys';

class Setting {
    path: Path;
    constructor() {
        this.path = new Path();
    }

    initSetting(): void {
        let setting: any = {};
        setting['project_path'] = '';
        setting['folder_stack'] = [];
        setting['theme'] = "SET_DARK";
        const configFilePath = this.path.getConfigFilePath();
        if (!fs.existsSync(this.path.getConfigFolderPath())) {
            fs.mkdirSync(this.path.getConfigFolderPath());
        }
        if (!fs.existsSync(this.path.getConfigFilePath())) {
            fs.writeFileSync(configFilePath, JSON.stringify(setting));
        }
    }

    async readSetting(): Promise<string> {
        const read = await new Promise<string>((resolve, reject) => {
            fs.readFile(this.path.getConfigFilePath(), 'utf-8', (err, data: string) => {
                if (err) {
                    console.log(err)
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        }).then((data: string) => {
            return data;
        }).catch((err) => {
            throw err;
        })
        return read;
    }

    async updateSetting(config: any) {
        const setting: Promise<string> = this.readSetting();
        return setting.then((settingFile: any) => {
            let parsedSetting = JSON.parse(settingFile);
            config.map((item: any) => {
                parsedSetting[item.key] = item.value;
            });
            fs.writeFileSync(this.path.getConfigFilePath(), JSON.stringify(parsedSetting));
        }).catch((err: any) => {
            throw err;
        })
    }

    getSettingByKey(data: string, key: string) {
        const settingJson = JSON.parse(data);
        let value = settingJson[key];
        if (value !== '') {
            return JSON.stringify(value);
        }
        return '';
    }
}

export default Setting;