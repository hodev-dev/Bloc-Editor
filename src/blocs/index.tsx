import Text from './Text';

const Bloc_Components: any = {
  Text: {
    name: "Text",
    component: Text
  },
  Image: {
    name: "Image",
    component: Text
  },
  Table: {
    name: "Table",
    component: Text
  },
  Link: {
    name: "Link",
    component: Text
  },
  Video: {
    name: "Video",
    component: Text
  },
  Map: {
    name: "Map",
    component: Text
  },
  Youtube: {
    name: "Youtube",
    component: Text
  },
  Figma: {
    name: "Figma",
    component: Text
  },
  Spotify: {
    name: "Spotify",
    component: Text
  },
  Notion: {
    name: "Notion",
    component: Text
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