import {app} from 'electron';
import * as path from 'path';
import * as dotenv  from 'dotenv';
const env = dotenv.config();

class Path {
   getConfigFolderPath(): string{
      return path.join(app.getPath('appData'),"Notilda-Config");
   }
   getConfigFilePath(): string{
    let configfolder: string = this.getConfigFolderPath();
    return path.join(configfolder,'setting.json');
   }
   normilizePath(path: string){
      return path.substring(1,path.length - 1);
  }
}

export default Path