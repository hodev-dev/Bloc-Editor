import React, { useEffect, useState, useRef } from 'react';
import Fuse from 'fuse.js';
import * as searchableListAction from '../../actions/searchableListAction';
import { useSelector, useDispatch } from 'react-redux';
import { IrootReducer } from '../../reducers/rootReducer';

const SearchableList = (props: any) => {

  /* ---------------------------- global variables ---------------------------- */
  interface IfuseOption {
    isCaseSensitive: boolean;
    shouldSort: boolean;
    includeMatches: boolean;
    findAllMatches: boolean;
    minMatchCharLength: number;
    location: number;
    threshold: number;
    distance: number;
    useExtendedSearch: boolean;
    keys: string[];
  }
  const fuseOptions: IfuseOption = {
    isCaseSensitive: false,
    // includeScore: false,
    shouldSort: true,
    includeMatches: false,
    findAllMatches: true,
    minMatchCharLength: 2,
    location: 0,
    threshold: 0.1,
    distance: 100,
    useExtendedSearch: false,
    keys: [
      'name'
    ]
  };
  const { theme } = useSelector((store: IrootReducer) => store.themeReducer);
  const theme_generate = ' ' + theme.default.bg.name + ' ' + theme.default.border.name + ' ' + theme.default.text.name;
  const theme_generate_no_border = ' ' + theme.default.bg.name + ' ' + theme.default.text.name;
  /* ------------------------------ local states ------------------------------ */
  const { list, display, is_exist, callback } = props;
  const inputRef = useRef<any>(null);
  const bodyRef = useRef<any>(null);
  const [value, setValue] = useState('');
  const [listArray, setListArray] = useState(list);
  const [cursor, setCursor] = useState(0);
  const [fuse, setFuse] = useState<any>();
  /* --------------------------------- effects -------------------------------- */
  useEffect(() => {
    let fuse: Fuse<any, IfuseOption> = new Fuse(list, fuseOptions);
    setFuse(fuse);
  }, []);

  useEffect(() => {
    setListArray(list);
  }, [list]);

  useEffect(() => {
  }, [display]);

  useEffect(() => {
    if (fuse) {
      let search = fuse.search(value);
      if (search) {
        setListArray(search)
      }
    }
    if (value === '') {
      setListArray(list);
    }
  }, [value, cursor]);

  /* --------------------------------- events --------------------------------- */
  const handleChange = () => {
    setValue(inputRef.current.value);
    setCursor(0);
  }

  const normalizer = (component: any) => {
    return (component.item) ? component.item.name : component.name
  }

  const handleKeyDown = (e: any) => {
    // handle arrow up and arrow down key
    if (e.keyCode === 38 && cursor > 0) {
      // e.preventDefault();
      setCursor((prevCursor) => prevCursor - 1);
      // bodyRef.current.scrollTo(bodyRef.current.scrollTop, bodyRef.current.scrollTop - bodyRef.current.childNodes[cursor - 1].scrollHeight);
    } else if (e.keyCode === 40 && cursor < listArray.length - 1) {
      // e.preventDefault();
      setCursor((prevCursor) => prevCursor + 1);
      // bodyRef.current.scrollTo(bodyRef.current.scrollTop, bodyRef.current.childNodes[cursor + 1].scrollHeight + bodyRef.current.scrollTop);
    } else if (e.keyCode === 13) {
      console.log({ listArray })
      const _listAraay = (listArray[cursor].item) ? listArray[cursor].item : listArray[cursor];
      callback(_listAraay);
    } else if (e.keyCode === 27) {
      searchableListAction.dispatchToggleDisplay();
      setValue('');
      setListArray(list);
    }
  }
  /* ---------------------------- render functions ---------------------------- */
  const renderBlocComponentList = () => {
    return listArray.map((component: any, index: number) => {
      return (
        <div key={index} className={(index === cursor) ? "flex w-full auto border border-pink-700 mt-2 p-1 text-gray-500 bg-pink-100 select-none cursor-pointer" + theme_generate_no_border : "flex w-full border mt-2 p-1 text-gray-500 bg-gray-100 select-none cursor-pointer" + theme_generate}>
          <div className="w-10/12 p-2 font-light">
            {normalizer(component)}
          </div>
        </div>
      )
    });
  }
  /* ------------------------------- main render ------------------------------ */
  if (display && is_exist) {
    return (
      <div className={"absolute z-50 top-0 left-0 w-full flex flex-col justify-center mt-12 items-center"}>
        <div className={"w-3/6 bg-gray-100 border" + theme_generate} >
          <input placeholder="Press Enter To Add Component To Page" autoFocus onKeyDown={(e: any) => handleKeyDown(e)} onChange={() => handleChange()} className={"w-full h-10 border border-pink-900 bg-gray-white border-2 focus:border-pink-900 outline-none p-2 " + theme_generate} type="text" ref={inputRef} />
        </div>
        <div className={"w-3/6 bg-gray-200 border h-64 border overflow-y-scroll" + theme_generate} ref={bodyRef}>
          {renderBlocComponentList()}
        </div>
      </div >
    );
  } else {
    return (
      <div></div>
    )
  }


}

export default SearchableList;
