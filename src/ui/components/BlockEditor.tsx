import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _, { divide, last, toPlainObject } from 'lodash';
import * as cmp from '../../blocs';
import * as uuid from 'uuid';
import Fuse from 'fuse.js';
import * as filesAction from '../../actions/filesAction';
import * as searchableListAction from '../../actions/searchableListAction';
import SearchableList from "../components/SearchableList";
import Prompt from '../components/Prompt';
import { IrootReducer } from '../../reducers/rootReducer';
import { render } from 'react-dom';
import BlocEditorIcon from './BlocEditorIcon';
const ipcRenderer = window.require('electron').ipcRenderer;
/* ------------------------------ import types ------------------------------ */

const BlockEditor = () => {
	/* ---------------------------------- types --------------------------------- */
	interface IComponentsList {
		item?: any,
		id: any,
		component: (props: any) => JSX.Element | any
		state: any
	}
	/* ------------------------------ globla state ------------------------------ */
	const ITEMS_PER_PAGE: number = 10;
	const dispatch = useDispatch();

	const searchRef = useRef(null) as any;
	const interRef = useRef() as any;
	const { past_bloc_state } = useSelector((store: IrootReducer) => store.blocReducer);
	const { bloc_state } = useSelector((store: IrootReducer) => store.blocReducer);
	const { future_bloc_state } = useSelector((store: IrootReducer) => store.blocReducer);
	const { bloc_name } = useSelector((store: IrootReducer) => store.blocReducer);
	const { bloc_path } = useSelector((store: IrootReducer) => store.blocReducer);
	const { project_path } = useSelector((store: IrootReducer) => store.filesReducer);
	const { display } = useSelector((store: IrootReducer) => store.searchableListReducer);
	const { theme } = useSelector((store: IrootReducer) => store.themeReducer);
	const theme_generate = ' ' + theme.default.bg.name + ' ' + theme.default.border.name + ' ' + theme.default.text.name;
	/* ------------------------------- local state ------------------------------ */
	const componetsListInit: Array<IComponentsList> = [];

	const [componentList, setComponentList] = useState<Array<IComponentsList>>(bloc_state);
	const [selectId, setSelectId] = useState<string>('');
	const [selectIndex, setSelectIndex] = useState<any>();
	const [showControll, setShowControll] = useState<boolean>(false);
	const [showsearch, setShowSearch] = useState<boolean>(false);
	const [showMoreControll, setShowMoreControll] = useState<boolean>(false);
	const [toInput, setToInput] = useState<number>(-1);
	const [searchResult, setSearchResult] = useState<Array<any>>([]);
	const [totalPages, setTotalPages] = useState<number>(0);
	const [pageNumber, setPageNumber] = useState<number>(0);
	const [renderIndex, setRenderIndex] = useState<number>(0);
	const [lastItem, setLastItem] = useState<number>(0);
	const [lock, setLock] = useState<boolean>(false);

	/* ---------------------------------- hooks --------------------------------- */
	useEffect(() => {
		searchableListAction.listen();
		return () => {
			searchableListAction.unsubscribe();
		};
	}, [])

	useEffect(() => {
	}, [renderIndex])

	useEffect(() => {
		console.log('change bloc state');
		setComponentList(bloc_state);
		setRenderIndex(0);
	}, [bloc_state])


	useEffect(() => {
	}, [past_bloc_state])

	useEffect(() => {
		if (componentList.length !== 0) {
			let totalPage = (componentList.length + ITEMS_PER_PAGE - 1) / ITEMS_PER_PAGE;
			setTotalPages(totalPage);
			setLastItem(componentList.length);
		}
	}, [componentList])

	useEffect(() => {
	}, [componentList])

	/* --------------------------------- methods -------------------------------- */
	const reOrderComponents = (_dragIndex: number, _dropIndex: number, pos: string,) => {
		dispatch(filesAction.add_to_past(componentList));
		let clone: any = [...componentList];
		let newDropIndex: number = _dropIndex;
		let cutOut = clone.splice(_dragIndex, 1)[0];
		if (_dragIndex === 0 && pos === 'BEFORE') {
			newDropIndex = _dropIndex;
		}
		if (_dropIndex === 0 && pos === "AFTER") {
			newDropIndex = _dropIndex + 1;
		}
		if (_dropIndex > 0 && pos === 'AFTER') {
			if (_dragIndex > _dropIndex) {
				newDropIndex = _dropIndex + 1;
			} else {
				newDropIndex = _dropIndex;
			}
		}
		clone.splice(newDropIndex, 0, cutOut);
		setComponentList(clone);
		clone = [];
		setShowControll(false);
	}

	const swapComponents = (_dragIndex: number, _dropIndex: number, mod: string) => {
		if (mod === 'SHIFTUP' && _dropIndex > 0) {
			_dropIndex = _dropIndex - 1;
		} else if (mod === 'SHIFTDOWN' && _dropIndex < componentList.length - 1) {
			_dropIndex = _dropIndex + 1;
		} else if ((mod === 'SWAP') && (_dropIndex <= componentList.length || _dropIndex >= componentList.length)) {
			if (_dropIndex === 0) {
				_dropIndex = _dropIndex
			} else {
				_dropIndex = _dropIndex - 1;
			}
		}
		let componentListClone = [...componentList];
		let temp = componentListClone[_dragIndex];
		componentListClone[_dragIndex] = componentListClone[_dropIndex];
		componentListClone[_dropIndex] = temp;
		dispatch(filesAction.add_to_past(componentList));
		setComponentList(componentListClone);
		componentListClone = [];
	}

	const deleteComponent = (index: number) => {
		dispatch(filesAction.add_to_past(componentList));
		const cmp = componentList.filter((item: any, _index: number) => _index !== index);
		setComponentList(cmp);
		setShowControll(false);
	}

	const componentInput = (e: React.FormEvent<HTMLInputElement>) => {
		setToInput(Number((e.target as HTMLInputElement).value));
	}

	const saveFile = () => {
		console.log({ componentList });
		dispatch(filesAction.save_file(bloc_path, componentList));
		dispatch(filesAction.togge_is_changed(false));
	}

	const undo = () => {
		console.log('undo')
		dispatch(filesAction.undo(future_bloc_state, componentList, past_bloc_state));
	}

	const redo = () => {
		console.log('redo')
		dispatch(filesAction.redo(future_bloc_state, componentList, past_bloc_state));
	}

	const showSearch = () => {
		setShowSearch((prevSearch) => !prevSearch);
	}

	/* --------------------------------- events --------------------------------- */
	const toggleControll = useCallback((e: any, id: string, index: number) => {
		setSelectId(id);
		setSelectIndex(index);
		setShowControll(true);
	}, []);

	const add_component = (_component: any) => {
		const _generate_component = {
			id: uuid.v1(),
			component: _component.component,
			state: ''
		}
		dispatch(filesAction.add_to_past(componentList));
		setComponentList((prevState: Array<IComponentsList>) => [_generate_component, ...prevState,]);
	}

	const handle_key_down_on_more_control = (e: any) => {
		if (e.keyCode === 27) {
			setShowMoreControll(false);
			setShowControll(false);
		}
	}

	const handleSearchInput = () => {
		console.log({ componentList });
		if (searchRef.current.value === '') {
			setSearchResult([]);
		} else {
			const options = {
				isCaseSensitive: false,
				includeScore: true,
				shouldSort: true,
				// includeMatches: true,
				findAllMatches: true,
				// minMatchCharLength: 0,
				// location: 100000,
				threshold: 0.5,
				// distance: 100,
				useExtendedSearch: true,
				ignoreLocation: true,
				ignoreFieldNorm: true,
				keys: [
					'state.value',
					'state.title',
					'state.description',
					'state.cardTitle'
				]
			};
			var fuse: any = new Fuse(componentList, options);
			const result = fuse.search(searchRef.current.value);
			console.log({ result });
			if (result.length > 0) {
				setSearchResult(result);
				fuse = null;
			}
		}
	}

	const handleChange = (key: string, state: any) => {
		componentList.map((component) => {
			if (component.id === key) {
				component.state = state;
			}
		});
		searchResult.map((component) => {
			if (component.item.id === key) {
				component.item.state = state;
			}
		});
	};

	const handleLoadMore = () => {
		if (renderIndex + ITEMS_PER_PAGE <= lastItem) {
			setRenderIndex(renderIndex + ITEMS_PER_PAGE);
			setPageNumber(pageNumber + 1);
		}
	}

	const handleLoadBack = () => {
		if (renderIndex - ITEMS_PER_PAGE >= 0) {
			setRenderIndex(renderIndex - ITEMS_PER_PAGE);
			setPageNumber(pageNumber - 1);
		}
	}
	const handelAddComponent = () => {
		searchableListAction.dispatchToggleDisplay();
	}
	/* ---------------------------- render functions ---------------------------- */

	const renderSearch = () => {
		if (showsearch) {
			return (
				<div className="flex flex-row w-full h-10 bg-gray-200">
					<input onChange={handleSearchInput} ref={searchRef} placeholder="Enter Search Query" className={"w-full h-10 text-2xl border" + theme_generate} type="text" />
				</div>
			)
		}
		return '';
	}

	const renderTopPanel = () => {
		if (bloc_state.length > 0) {
			//
			return (
				<div className={"sticky bottom-0 select-none"}>
					<nav className={"sticky flex items-center justify-between mx-auto " + theme_generate}>
						{/* ---------------------------------- left ---------------------------------- */}
						<div className="items-center justify-start hidden w-1/3 h-8 mt-1 ml-2 md:flex">
							<svg onClick={handelAddComponent} className={"w-8 h-8 cursor-pointer fill-current" + theme_generate} xmlns="http://www.w3.org/2000/svg"><path d="M17 11a1 1 0 0 1 0 2h-4v4a1 1 0 0 1-2 0v-4H7a1 1 0 0 1 0-2h4V7a1 1 0 0 1 2 0v4h4z" /></svg>
						</div>
						{/* --------------------------------- center --------------------------------- */}
						<div className="flex items-center justify-center w-1/3 mx-auto">
							<h2 className="text-sm font-semibold text-gray-700">{bloc_name}</h2>
						</div>
						{/* ---------------------------------- right --------------------------------- */}
						<div className="items-stretch justify-end hidden w-1/3 mx-auto md:flex">
							<button onClick={() => showSearch()} className="p-2 text-sm font-semibold text-gray-700 rounded">Search</button>
							<button onClick={() => undo()} className="p-2 text-sm font-semibold text-gray-700 rounded">Undo</button>
							<button onClick={() => redo()} className="p-2 text-sm font-semibold text-gray-700 rounded">Redo</button>
							<button onClick={() => saveFile()} className="p-2 text-sm font-semibold text-gray-700 rounded">Save</button>
							<button onClick={() => dispatch(filesAction.close())} className="p-2 text-sm font-semibold text-gray-700 rounded">Close The File</button>
						</div>
					</nav>
					{renderSearch()}
				</div>
			)
		} else {
			return (
				''
			)
		}
	}

	const renderBlocPlaceHolder = () => {
		return (
			<div className={"flex flex-col items-center justify-center w-full h-screen overflow-hidden bg-gray-200" + theme_generate}>
				<div className={"flex flex-row justify-center mx-auto mt-5 min-w-64" + theme_generate}>
					{BlocEditorIcon()}
				</div>
				<div className="flex flex-row justify-center w-8/12 mx-auto mt-1">
					<h1 className="text-5xl font-light text-pink-900 select-none">.Bloc Editor</h1>
				</div>
				<div className="flex flex-row justify-center w-8/12 mx-auto mt-3">
					<table className="w-4/12">
						<tr className={"flex justify-center"}>
							<td className={"flex items-center justify-center w-40 p-2 font-semibold border" + theme_generate}>Command Prompt</td>
							<td className={"flex items-center justify-center w-40 p-2 border" + theme_generate}>Control</td>
							<td className={"flex items-center justify-center w-40 p-2 border" + theme_generate}>P</td>
						</tr>
						<tr className={"flex justify-center"}>
							<td className={"flex items-center justify-center w-40 p-2 font-semibold border" + theme_generate}>Add Component</td>
							<td className={"flex items-center justify-center w-40 p-2 border" + theme_generate}>Control</td>
							<td className={"flex items-center justify-center w-40 p-2 border" + theme_generate}>N</td>
						</tr>
						<tr className={"flex justify-center"}>
							<td className={"flex items-center justify-center w-40 p-2 font-semibold border" + theme_generate}>Toggle Explorer</td>
							<td className={"flex items-center justify-center w-40 p-2 border" + theme_generate}>Control</td>
							<td className={"flex items-center justify-center w-40 p-2 border" + theme_generate}>B</td>
						</tr>
					</table>
				</div>
			</div>
		)
	}

	const renderMoreControll = (index: number) => {
		if (showMoreControll) {
			return (
				<div className={"flex items-center justify-center border" + theme_generate} onKeyDown={(e) => handle_key_down_on_more_control(e)}>
					<svg onClick={() => setShowMoreControll(false)} className={"w-4 h-4 m-2 cursor-pointer fill-current" + theme_generate} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
						<path d="M7.05 9.293L6.343 10 12 15.657l1.414-1.414L9.172 10l4.242-4.243L12 4.343z" />
					</svg>
					<div className="">
						<input disabled placeholder={String(index + 1)} className={"w-32 text-center" + theme_generate} type="text" maxLength={5} />
						<span className={"p-2 border-l-2 border-r-2" + theme_generate}>To</span>
						<input onChange={(e) => componentInput(e)} placeholder="block number" className={"w-32 text-center" + theme_generate} type="text" maxLength={5} />
						<button onClick={() => reOrderComponents(Number(index), Number(toInput - 1), 'BEFORE')} className={"p-2 border-l-2 btn hover:bg-gray-300" + theme_generate}>Before</button>
						<button onClick={() => swapComponents(index, toInput, 'SWAP')} className={"p-2 border-l-2 btn hover:bg-gray-300" + theme_generate}>Swap</button>
						<button onClick={() => reOrderComponents(Number(index), Number(toInput - 1), 'AFTER')} className={"p-2 border-l-2 btn hover:bg-gray-300" + theme_generate}>After</button>
					</div>
				</div>
			)
		} else {
			return (
				<svg onClick={() => setShowMoreControll(true)} className={"w-4 h-4 m-2 cursor-pointer fill-current" + theme_generate} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
					<path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
				</svg>
			)
		}
	}

	const renderControl = useCallback(() => {
		return (
			<div className={"absolute top-0 z-50 flex items-center w-auto h-10 ml-10 bg-white border" + theme_generate} >
				<svg onClick={() => setShowControll(false)} className={"w-3 h-3 m-2 cursor-pointer fill-current" + theme_generate} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" /></svg>
				<svg onClick={() => swapComponents(selectIndex, selectIndex, 'SHIFTUP')} className="w-4 h-4 m-2 cursor-pointer fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10.707 7.05L10 6.343 4.343 12l1.414 1.414L10 9.172l4.243 4.242L15.657 12z" /></svg>
				<svg onClick={() => swapComponents(selectIndex, selectIndex, 'SHIFTDOWN')} className="w-4 h-4 m-2 cursor-pointer fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
				{/* <svg className="w-4 h-4 m-2 cursor-pointer fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M6 6V2c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4v4a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h4zm2 0h4a2 2 0 0 1 2 2v4h4V2H8v4zM2 8v10h10V8H2z" /></svg> */}
				{/* <svg className="w-4 h-4 m-2 cursor-pointer fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 1l10 6-10 6L0 7l10-6zm6.67 10L20 13l-10 6-10-6 3.33-2L10 15l6.67-4z" /></svg> */}
				<svg onClick={() => deleteComponent(selectIndex)} className="w-4 h-4 m-2 cursor-pointer fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z" /></svg>
				{renderMoreControll(selectIndex)}
			</div>
		)
	}, [selectIndex, toggleControll, renderMoreControll]);

	const memoIndex = useCallback((index: number, callback: any) => {
		return (
			<div className={"flex items-center justify-center w-10 h-10 mr-2 text-gray-500 bg-white border border-l-0" + theme_generate} >{++index}</div>
		)
	}, [theme_generate]);

	const renderIfSelected = (component: any, index: any) => {
		let render: any;
		if (selectIndex === index && showControll === true) {
			render = (
				<div className="flex" key={index}>
					{memoIndex(index, () => 0)}
					{renderControl()}
				</div>
			)
		} else {
			render = (
				<div className="relative flex" key={index}>
					<div onMouseEnter={(e) => toggleControll(e, component.id, index)} className={"flex items-center justify-center w-10 h-10 mr-2 text-gray-500 bg-white border border-l-0" + theme_generate}>{index + 1}</div>
				</div>
			)
		}
		if (index >= renderIndex && index < renderIndex + ITEMS_PER_PAGE) {
			return render;
		}
	};

	const renderBack = () => {
		if (renderIndex > 0) {
			return (
				<div className="w-full">
					<div onClick={handleLoadBack} className={"flex items-center justify-center w-full h-16 border cursor-pointer hover:border-pink-900 hover:text-pink-900" + theme_generate}>Go Back</div>
				</div>
			)
		}
	}

	const renderMore = () => {
		return (
			<div className="w-full">
				<div onClick={handleLoadMore} className={"flex items-center justify-center w-full h-16 border cursor-pointer hover:border-pink-900 hover:text-pink-900" + theme_generate}>Load More</div>
			</div>
		)
	}
	const handlePageClick = (page: number) => {
		setRenderIndex(page * ITEMS_PER_PAGE);
		setPageNumber(page);
	}

	const renderPages = () => {
		const pages = Array.from({ length: totalPages }, (x, i) => i);
		return pages.map((page: number) => {
			return (
				<div onClick={() => handlePageClick(page)} key={page} className={(pageNumber === page) ? "flex items-center justify-center w-1/12 h-16 border cursor-pointer border-pink-900 hover:text-pink-900" : "flex items-center justify-center w-1/12 h-16 border cursor-pointer hover:border-pink-900 hover:text-pink-900" + theme_generate} >{page}</div>
			);
		});
	}

	const renderComponentBody = (component: any, index: number) => {
		if (index === lastItem - 1 && index >= renderIndex && index < renderIndex + ITEMS_PER_PAGE - 1) {
			return (
				<div className="w-full" id={component.id} data-id={component.id} key={component.id}>
					<component.component id={component.id} key={component.id} title={component.state} initState={component.state} change={handleChange} lock={lock} />
					<div className={"flex flex-row flex-wrap w-full mt-2" + theme_generate}>
						{renderBack()}
						{renderMore()}
						{renderPages()}
					</div>
				</div >
			);
		}
		else if (index >= renderIndex && index < renderIndex + ITEMS_PER_PAGE - 1) {
			return (
				<div className="w-full" id={component.id} data-id={component.id} key={component.id}>
					<component.component id={component.id} key={component.id} title={component.state} initState={component.state} change={handleChange} lock={lock} />
				</div >
			)
		}
		else if (index === renderIndex + ITEMS_PER_PAGE - 1) {
			return (
				<div className="w-full" id={component.id} data-id={component.id} key={component.id}>
					<component.component id={component.id} key={component.id} title={component.state} initState={component.state} change={handleChange} lock={lock} />
					<div className={"flex flex-row flex-wrap w-full mt-2 " + theme_generate}>
						{renderBack()}
						{renderMore()}
						{renderPages()}
					</div>
				</div >
			);
		}
	};


	const renderComponents = () => {
		var renderList;
		if (searchResult && searchResult.length > 0) {
			renderList = searchResult;
		} else {
			renderList = componentList;
		}
		return renderList.map((component: IComponentsList, index: number) => {
			if (component.item) {
				component = component.item;
			}
			if (typeof (component.component) === 'string') {
				if (component.component !== cmp.Bloc_Components[component.component]['component']) {
					component.component = cmp.Bloc_Components[component.component]['component'];
				}
			}
			return (
				<div className="relative flex" key={index}>
					{renderIfSelected(component, index)}
					{renderComponentBody(component, index)}
				</div>
			)
		});
	};
	/* ------------------------------- main render ------------------------------ */
	return (
		<div className={"relative flex flex-col w-full max-h-screen bg-white" + theme_generate} >
			{renderTopPanel()}
			<div className="h-auto overflow-y-scroll">
				{(bloc_state.length === 0) ? renderBlocPlaceHolder() : renderComponents()}
			</div>
			<SearchableList display={display} list={cmp.Bloc_Components_Array} is_exist={bloc_path} callback={add_component} />
			<Prompt />
		</div>
	);
}

export default BlockEditor;
