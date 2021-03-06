import Text from './Text';
import HeaderText from './HeaderText';
import Image from './Image';
import LinkPreview from './LinkPreview';
import { Code } from './Code/Code';
import { Video } from './Video';

const Bloc_Components: any = {
  HeaderText: {
    name: "HeaderText",
    component: HeaderText
  },
  Image: {
    name: "Image",
    component: Image
  },
  Text: {
    name: "Text",
    component: Text
  },
  LinkPreview: {
    name: "LinkPreview",
    component: LinkPreview
  },
  Code: {
    name: "Code",
    component: Code
  },
  Video: {
    name: "Video",
    component: Video
  },
}

let Bloc_Components_Array: Array<any> = [];
Object.keys(Bloc_Components).map(key => {
  Bloc_Components_Array.push(Bloc_Components[key]);
});

export {
  Bloc_Components,
  Bloc_Components_Array,
}