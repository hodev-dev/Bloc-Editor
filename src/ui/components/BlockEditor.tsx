import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import * as cmp from '../../blocs';
import * as uuid from 'uuid';
import Fuse from 'fuse.js';
import * as filesAction from '../../actions/filesAction';
import * as searchableListAction from '../../actions/searchableListAction';
import SearchableList from "../components/SearchableList";
import Prompt from '../components/Prompt';

/* ------------------------------ import types ------------------------------ */
import { IrootReducer } from '../../reducers/rootReducer';

const BlockEditor = () => {
	/* ---------------------------------- types --------------------------------- */
	interface IComponentsList {
		item?: any,
		id: any,
		component: (props: any) => JSX.Element | any
		state: any
	}
	/* ------------------------------ globla state ------------------------------ */
	const dispatch = useDispatch();
	const searchRef = useRef<any>(null);
	const { past_bloc_state } = useSelector((store: IrootReducer) => store.blocReducer);
	const { bloc_state } = useSelector((store: IrootReducer) => store.blocReducer);
	const { future_bloc_state } = useSelector((store: IrootReducer) => store.blocReducer);
	const { bloc_name } = useSelector((store: IrootReducer) => store.blocReducer);
	const { bloc_path } = useSelector((store: IrootReducer) => store.blocReducer);
	const { display } = useSelector((store: IrootReducer) => store.searchableListReducer);
	const { theme } = useSelector((store: IrootReducer) => store.themeReducer);
	const theme_generate = ' ' + theme.default.bg + ' ' + theme.default.border + ' ' + theme.default.text;
	/* ------------------------------- local state ------------------------------ */
	const componetsListInit: Array<IComponentsList> = [];

	const [componentList, setComponentList] = useState<Array<IComponentsList>>(bloc_state);
	const [selectId, setSelectId] = useState<string>('');
	const [showControll, setShowControll] = useState<boolean>(false);
	const [dragging, setDragging] = useState<boolean>(false);
	const [showMoreControll, setShowMoreControll] = useState<boolean>(false);
	const [toInput, setToInput] = useState<number>(-1);
	const [searchResult, setSearchResult] = useState<Array<any>>([]);

	/* ---------------------------------- hooks --------------------------------- */
	useEffect(() => {
		searchableListAction.listen();
		console.log(componentList);
		return () => {
			searchableListAction.unsubscribe();
		};
	}, [])

	useEffect(() => {
		setComponentList(bloc_state);
		console.log({ bloc_state });
	}, [bloc_state])

	useEffect(() => {
		console.log({ past_bloc_state })
	}, [past_bloc_state])


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
			_dropIndex = _dropIndex - 1;
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

	/* --------------------------------- events --------------------------------- */
	const toggleControll = (e: any, id: string) => {
		setSelectId(id);
		setShowControll(true);
	}
	const add_component = (_component: any) => {
		const _generate_component = {
			id: uuid.v1(),
			component: _component.component,
			state: ''
		}
		dispatch(filesAction.add_to_past(componentList));
		setComponentList((prevState: Array<IComponentsList>) => [...prevState, _generate_component]);
	}

	const handle_key_down_on_more_control = (e: any) => {
		if (e.keyCode === 27) {
			setShowMoreControll(false);
			setShowControll(false);
		}
	}

	const handleSearchInput = () => {
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
				// location: 1000,
				// threshold: 1,
				// distance: 100,
				useExtendedSearch: true,
				ignoreLocation: true,
				ignoreFieldNorm: true,
				keys: [
					'state.value',
					'state.title',
					'state.description',
				]
			};
			var fuse: any = new Fuse(bloc_state, options);
			const result = fuse.search(searchRef.current.value);
			if (result.length > 0) {
				setSearchResult(result);
				fuse = null;
			}
		}
	}

	const handleChange = (key: string, state: any) => {
		console.log({ state });
		componentList.map((component) => {
			if (component.id === key) {
				component.state = state;
			}
		});
		if (searchResult.length > 0) {
			searchResult.map((component) => {
				console.log("search result component", { component });
				console.log("search are qual", component.item.id === key);
				if (component.item.id === key) {
					component.item.state = state;
				}
			});
		}
	}

	/* ---------------------------- render functions ---------------------------- */
	const renderMoreControll = (index: number) => {
		if (showMoreControll) {
			return (
				<div className={"flex items-center justify-center border" + theme_generate} onKeyDown={(e) => handle_key_down_on_more_control(e)}>
					<svg onClick={() => setShowMoreControll(false)} className={"w-4 h-4 m-2 fill-current cursor-pointer" + theme_generate} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
						<path d="M7.05 9.293L6.343 10 12 15.657l1.414-1.414L9.172 10l4.242-4.243L12 4.343z" />
					</svg>
					<div className="">
						<input disabled placeholder={String(index + 1)} className={"w-32 text-center" + theme_generate} type="text" maxLength={5} />
						<span className={"border-l-2 border-r-2 p-2" + theme_generate}>To</span>
						<input onChange={(e) => componentInput(e)} placeholder="block number" className={"w-32 text-center" + theme_generate} type="text" maxLength={5} />
						<button onClick={() => reOrderComponents(Number(index), Number(toInput - 1), 'BEFORE')} className={"btn border-l-2 p-2 hover:bg-gray-300" + theme_generate}>Before</button>
						<button onClick={() => swapComponents(index, toInput, 'SWAP')} className={"btn border-l-2 p-2 hover:bg-gray-300" + theme_generate}>Swap</button>
						<button onClick={() => reOrderComponents(Number(index), Number(toInput - 1), 'AFTER')} className={"btn border-l-2 p-2 hover:bg-gray-300" + theme_generate}>After</button>
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


	const renderTopPanel = () => {
		if (bloc_state.length > 0) {
			// 
			return (
				<div className={"sticky bottom-0"}>
					<nav className={"flex sticky items-center justify-between border mx-auto " + theme_generate}>
						{/* ---------------------------------- left ---------------------------------- */}
						<div className="hidden md:flex justify-start items-center mx-auto w-1/3 h-4">
							<h2 className="text-gray-700 text-sm font-semibold ">{bloc_path}</h2>
						</div>
						{/* --------------------------------- center --------------------------------- */}
						<div className="flex justify-center items-center w-1/3  mx-auto">
							<h2 className="text-gray-700 text-sm font-semibold">{bloc_name}</h2>
						</div>
						{/* ---------------------------------- right --------------------------------- */}
						<div className="hidden md:flex justify-end items-stretch mx-auto w-1/3">
							<button onClick={() => saveFile()} className="text-gray-700 text-sm font-semibold rounded p-2">Save</button>
							<button onClick={() => undo()} className="text-gray-700 text-sm font-semibold rounded p-2">Undo</button>
							<button onClick={() => redo()} className="text-gray-700 text-sm font-semibold rounded p-2">Redo</button>
						</div>
					</nav>
					<div className="flex flex-row bg-gray-200 w-full h-10">
						<input onChange={handleSearchInput} ref={searchRef} placeholder="Enter Search Query" className={"h-10 text-2xl w-full border" + theme_generate} type="text" />
					</div>
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
			<div className={"flex w-full flex-col items-center justify-center bg-gray-200 h-screen overflow-hidden" + theme_generate}>
				<div className="flex flex-row mt-5 mx-auto w-8/12 justify-center">
					<h1 className="font-light text-6xl text-pink-900 select-none">.Bloc Editor</h1>
				</div>
				<div className={"flex flex-row mt-5 mx-auto min-w-64 justify-center" + theme_generate}>

				</div>
				<div className={"flex flex-row mt-5 mx-auto min-w-64 justify-center" + theme_generate}>

				</div>
			</div>
		)
	}



	const renderComponents = () => {
		var renderList;
		if (searchResult.length > 0) {
			renderList = searchResult;
		} else {
			renderList = componentList;
		}
		return renderList.map((component: IComponentsList, index: number) => {
			if (component.item) {
				component = component.item;
			}
			if (typeof (component.component) === 'string') {
				component.component = cmp.Bloc_Components[component.component]['component'];
			}
			if (String(selectId) === String(component.id) && showControll === true) {
				return (
					<div className="flex relative" key={component.id}>
						<div className={"bg-white w-10 h-10 mr-2 border border-l-0 flex items-center justify-center text-gray-500" + theme_generate} >{index + 1}</div>
						<div className={"absolute top-0 flex w-auto bg-white h-10 border items-center ml-10 z-50" + theme_generate} >
							<svg onClick={() => setShowControll(false)} className={"w-3 h-3 m-2 cursor-pointer fill-current" + theme_generate} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" /></svg>
							<svg onClick={() => swapComponents(index, index, 'SHIFTUP')} className="w-4 h-4 m-2 cursor-pointer fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10.707 7.05L10 6.343 4.343 12l1.414 1.414L10 9.172l4.243 4.242L15.657 12z" /></svg>
							<svg onClick={() => swapComponents(index, index, 'SHIFTDOWN')} className="w-4 h-4 m-2 cursor-pointer fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
							<svg className="w-4 h-4 m-2 cursor-pointer fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M6 6V2c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4v4a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h4zm2 0h4a2 2 0 0 1 2 2v4h4V2H8v4zM2 8v10h10V8H2z" /></svg>
							<svg className="w-4 h-4 m-2 cursor-pointer fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 1l10 6-10 6L0 7l10-6zm6.67 10L20 13l-10 6-10-6 3.33-2L10 15l6.67-4z" /></svg>
							<svg onClick={() => deleteComponent(index)} className="w-4 h-4 m-2 cursor-pointer fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z" /></svg>
							{renderMoreControll(index)}
						</div>
						<div className="w-full" data-id={component.id} key={component.id}>
							<div key={component.id} >
								<component.component id={component.id} key={component.id} title={component.state} initState={component.state} change={handleChange} />
							</div>
						</div>
					</div>
				)
			}
			return (
				<div className="flex relative" key={component.id}>
					<div onMouseOver={(e) => toggleControll(e, component.id)} className={"bg-white w-10 h-10 mr-2 border border-l-0 flex items-center justify-center text-gray-500" + theme_generate}>{index + 1}</div>
					<div className={(dragging && component.id === selectId) ? "w-full opacity-25" : "w-full "} key={component.id}   >
						<div key={component.id} className="">
							<component.component id={component.id} key={component.id} title={component.state} initState={component.state} change={handleChange} />
						</div>
					</div>
				</div>
			)
		});
	}

	/* ------------------------------- main render ------------------------------ */
	return (
		<div className={"flex flex-col max-w-full w-full max-h-screen bg-white relative" + theme_generate}>
			{renderTopPanel()}
			<div className="overflow-y-scroll h-auto" >
				{(bloc_state.length === 0) ? renderBlocPlaceHolder() : renderComponents()}
			</div>
			<SearchableList display={display} list={cmp.Bloc_Components_Array} is_exist={bloc_path} callback={add_component} />
			<Prompt />
		</div>
	);
}

export default React.memo(BlockEditor);
