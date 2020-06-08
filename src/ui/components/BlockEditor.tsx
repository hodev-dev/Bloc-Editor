import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import * as cmp from '../../blocs';
import * as uuid from 'uuid';
import * as filesAction from '../../actions/filesAction';
import * as searchableListAction from '../../actions/searchableListAction';
import SearchableList from "../components/SearchableList";
import Prompt from '../components/Prompt';

/* ------------------------------ import types ------------------------------ */
import { IrootReducer } from '../../reducers/rootReducer';

const BlockEditor = () => {
	/* ---------------------------------- types --------------------------------- */
	interface IComponentsList {
		id: any,
		component: (props: any) => JSX.Element | any
		state: any
	}
	/* ------------------------------ globla state ------------------------------ */
	const dispatch = useDispatch();
	const { past_bloc_state } = useSelector((store: IrootReducer) => store.blocReducer);
	const { bloc_state } = useSelector((store: IrootReducer) => store.blocReducer);
	const { future_bloc_state } = useSelector((store: IrootReducer) => store.blocReducer);
	const { bloc_name } = useSelector((store: IrootReducer) => store.blocReducer);
	const { bloc_path } = useSelector((store: IrootReducer) => store.blocReducer);
	const { display } = useSelector((store: IrootReducer) => store.searchableListReducer);
	/* ------------------------------- local state ------------------------------ */
	const componetsListInit: Array<IComponentsList> = [];

	const [componentList, setComponentList] = useState<Array<IComponentsList>>(bloc_state);
	const [selectId, setSelectId] = useState<string>('');
	const [showDropZone, setShowDropZone] = useState<boolean>(false);
	const [showControll, setShowControll] = useState<boolean>(false);
	const [draggable, setDraggable] = useState<boolean>(true);
	const [dragIndex, setDragIndex] = useState<number>(0);
	const [dragging, setDragging] = useState<boolean>(false);
	const [isDraggedOn, setIsDraggedOn] = useState<boolean>(false);
	const [dragOverID, setDragOverID] = useState<string>('');
	const [draggOverPos, setDraggOverPos] = useState<string>('');
	const [showMoreControll, setShowMoreControll] = useState<boolean>(false);
	const [toInput, setToInput] = useState<number>(-1);

	/* ---------------------------------- hooks --------------------------------- */
	useEffect(() => {
		searchableListAction.listen();
		return () => {
			searchableListAction.unsubscribe();
		};
	}, [])

	useEffect(() => {
		setComponentList(bloc_state);
	}, [bloc_state])

	useEffect(() => {
		console.log({ past_bloc_state })
	}, [past_bloc_state])

	useEffect(() => {
		return () => {
			setDragOverID('')
		};
	}, [selectId]);

	/* --------------------------------- methods -------------------------------- */
	const reOrderComponents = (_dragIndex: number, _dropIndex: number, pos: string, ) => {
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
		setDraggable(true);
		setSelectId(id);
		setShowControll(true);
	}

	const dragEnter = (e: any, id: string, index: number) => {
		setDragIndex(index);
		setShowDropZone(true);
		setDragging(true);
		setShowControll(false);
	}

	const dragEnd = (e: any) => {
		setShowDropZone(false);
		setDragging(false);
	}

	const dragStart = (e: any) => {
		let elem: any = document.createElement("div");
		elem.textNode = "Dragging";
		e.dataTransfer.setDragImage(elem, 500, 600);
	}

	const dragOverDropZone = useMemo(() => {
		const throttled = _.throttle((e, _pos: string, _id: string) => {
			setIsDraggedOn(true);
			setDraggOverPos(_pos);
			setDragOverID(_id);
		}, 100);
		return (e: any, _pos: string, _id: string) => {
			e.preventDefault();
			e.persist();
			return throttled(e, _pos, _id);
		};
	}, []);

	const drop = async (e: any, index: number, _pos: string, _id: string) => {
		const pos = _pos;
		const _dragIndex = dragIndex;
		const _dropIndex = index;
		// dispatch(filesAction.togge_is_changed(true));
		console.log('drop')
		reOrderComponents(_dragIndex, _dropIndex, pos);
	}

	const add_component = (_component: any) => {
		const _generate_component = {
			id: uuid.v1(),
			component: _component.component,
			state: 'text'
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

	/* ---------------------------- render functions ---------------------------- */
	const renderMoreControll = (index: number) => {
		if (showMoreControll) {
			return (
				<div className="flex items-center justify-center" onKeyDown={(e) => handle_key_down_on_more_control(e)}>
					<svg onClick={() => setShowMoreControll(false)} className="w-4 h-4 m-2 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
						<path d="M7.05 9.293L6.343 10 12 15.657l1.414-1.414L9.172 10l4.242-4.243L12 4.343z" />
					</svg>
					<div className="">
						<input disabled placeholder={String(index + 1)} className="w-32 text-center" type="text" maxLength={5} />
						<span className="border-l-2 border-r-2 p-2">To</span>
						<input onChange={(e) => componentInput(e)} placeholder="block number" className="w-32 text-center" type="text" maxLength={5} />
						<button onClick={() => reOrderComponents(Number(index), Number(toInput - 1), 'BEFORE')} className="btn border-l-2 p-2 hover:bg-gray-300">Before</button>
						<button onClick={() => swapComponents(index, toInput, 'SWAP')} className="btn border-l-2 p-2 hover:bg-gray-300">Swap</button>
						<button onClick={() => reOrderComponents(Number(index), Number(toInput - 1), 'AFTER')} className="btn border-l-2 p-2 hover:bg-gray-300">After</button>
					</div>
				</div>
			)
		} else {
			return (
				<svg onClick={() => setShowMoreControll(true)} className="w-4 h-4 m-2 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
					<path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
				</svg>
			)
		}
	}

	const renderDropZones = (pos: string, index: number, id: string, component: any) => {
		const normalClass = "w-full h-6 border-dashed border-2 border-gray-600";
		const onDragOverClass = "w-full h-auto border-dashed border-2 border-pink-900 ";
		const draggedComponent = componentList[dragIndex];
		if (dragIndex !== index) {
			if (index === 0) {
				if (isDraggedOn && id === dragOverID && draggOverPos === pos) {
					return (
						<div data-id={id} data-index={index} data-dropid={id} data-pos={pos} className={(isDraggedOn && id === dragOverID && draggOverPos === pos) ? onDragOverClass : normalClass} onDragOver={(e) => dragOverDropZone(e, pos, id)} onDrop={(e) => drop(e, index, pos, id)}>
							<draggedComponent.component key={draggedComponent.id} title={draggedComponent.state} />
						</div>
					)
				} else {
					return (
						<div data-id={id} data-index={index} data-dropid={id} data-pos={pos} className={(isDraggedOn && id === dragOverID && draggOverPos === pos) ? onDragOverClass : normalClass} onDragOver={(e) => dragOverDropZone(e, pos, id)} onDrop={(e) => drop(e, index, pos, id)}></div>
					)
				}
			} else if (pos === 'AFTER') {
				if (isDraggedOn && id === dragOverID) {
					return (
						<div data-id={id} data-index={index} data-dropid={id} data-pos={pos} className={(isDraggedOn && id === dragOverID) ? onDragOverClass : normalClass} onDragOver={(e) => dragOverDropZone(e, pos, id)} onDrop={(e) => drop(e, index, pos, id)}>
							<draggedComponent.component key={draggedComponent.id} title={draggedComponent.state} />
						</div>
					)
				} else {
					return (
						<div data-id={id} data-index={index} data-dropid={id} data-pos={pos} className={(isDraggedOn && id === dragOverID) ? onDragOverClass : normalClass} onDragOver={(e) => dragOverDropZone(e, pos, id)} onDrop={(e) => drop(e, index, pos, id)}></div>
					)
				}
			}
			return (
				''
			)
		}
	}

	const renderTopPanel = () => {
		if (bloc_state.length > 0) {
			// 
			return (
				<div className="sticky bottom-0">
					<nav className="flex sticky items-center justify-between border mx-auto ">
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
			<div className="flex w-full flex-col items-center justify-center bg-gray-200 h-screen overflow-hidden">
				<div className="flex flex-row mt-5 mx-auto w-8/12 justify-center">
					<h1 className="font-light text-6xl text-pink-900 select-none">.Bloc Editor</h1>
				</div>
				<div className="flex flex-row mt-5 mx-auto min-w-64 justify-center">
					<h1 className="font-light text-lg text-gray-600 select-none  p-1 rounded bg-white border shadow-sm">Ctrl</h1>
					<h1 className="font-normal text-lg text-gray-900 select-none border-pink-900 p-1 ml-2">+</h1>
					<h1 className="font-light text-lg text-gray-600 select-none  p-1 rounded bg-white border shadow-sm">Shift</h1>
					<h1 className="font-normal text-lg text-gray-900 select-none border-pink-900 p-1 ml-2">+</h1>
					<h1 className="font-light text-lg text-gray-600 select-none  p-1 rounded bg-white border shadow-sm">P</h1>
					<h1 className="font-normal text-lg text-gray-900 select-none border-pink-900 p-1 ml-2">Command Prompt</h1>
				</div>
				<div className="flex flex-row mt-5 mx-auto min-w-64 justify-center">
					<h1 className="font-light text-lg text-gray-600 select-none  p-1 rounded bg-white border shadow-sm">Ctrl</h1>
					<h1 className="font-normal text-lg text-gray-900 select-none border-pink-900 p-1 ml-2">+</h1>
					<h1 className="font-light text-lg text-gray-600 select-none  p-1 rounded bg-white border shadow-sm">Shift</h1>
					<h1 className="font-normal text-lg text-gray-900 select-none border-pink-900 p-1 ml-2">+</h1>
					<h1 className="font-light text-lg text-gray-600 select-none  p-1 rounded bg-white border shadow-sm">N</h1>
					<h1 className="font-normal text-lg text-gray-900 select-none border-pink-900 p-1 ml-2">New Files</h1>
				</div>
			</div>
		)
	}

	const handleChange = (key: string, state: any) => {
		componentList.map((component) => {
			if (component.id === key) {
				component.state = state;
			}
		});
	}

	const renderComponents = () => {
		return componentList.map((component: IComponentsList, index: number) => {
			if (typeof (component.component) === 'string') {
				component.component = cmp.Bloc_Components[component.component]['component'];
			}
			if (String(selectId) === String(component.id) && showControll === true) {
				return (
					<div className="flex relative" key={component.id} draggable={draggable} onDragStart={(e: any) => dragStart(e)} onDragEnter={(e: any) => dragEnter(e, component.id, index)} >
						<div className="bg-white w-10 h-10 mr-2 border border-l-0 flex items-center justify-center text-gray-500" >{index + 1}</div>
						<div className="absolute top-0 flex w-auto bg-white h-10 border items-center ml-10" >
							<svg onClick={() => setShowControll(false)} className="w-3 h-3 m-2 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" /></svg>
							<svg className="w-4 h-4 m-2 cursor-move" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M1 1h2v2H1V1zm0 4h2v2H1V5zm0 4h2v2H1V9zm0 4h2v2H1v-2zm0 4h2v2H1v-2zM5 1h2v2H5V1zm0 8h2v2H5V9zm0 8h2v2H5v-2zM9 1h2v2H9V1zm0 4h2v2H9V5zm0 4h2v2H9V9zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm4-16h2v2h-2V1zm0 8h2v2h-2V9zm0 8h2v2h-2v-2zm4-16h2v2h-2V1zm0 4h2v2h-2V5zm0 4h2v2h-2V9zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z" /></svg>
							<svg onClick={() => swapComponents(index, index, 'SHIFTUP')} className="w-4 h-4 m-2 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10.707 7.05L10 6.343 4.343 12l1.414 1.414L10 9.172l4.243 4.242L15.657 12z" /></svg>
							<svg onClick={() => swapComponents(index, index, 'SHIFTDOWN')} className="w-4 h-4 m-2 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
							<svg className="w-4 h-4 m-2 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M6 6V2c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4v4a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h4zm2 0h4a2 2 0 0 1 2 2v4h4V2H8v4zM2 8v10h10V8H2z" /></svg>
							<svg className="w-4 h-4 m-2 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 1l10 6-10 6L0 7l10-6zm6.67 10L20 13l-10 6-10-6 3.33-2L10 15l6.67-4z" /></svg>
							<svg onClick={() => deleteComponent(index)} className="w-4 h-4 m-2 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z" /></svg>
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
					<div onMouseOver={(e) => toggleControll(e, component.id)} className="bg-white w-10 h-10 mr-2 border border-l-0 flex items-center justify-center text-gray-500">{index + 1}</div>
					<div className={(dragging && component.id === selectId) ? "w-full opacity-25" : "w-full "} key={component.id}   >
						{(showDropZone) ? renderDropZones('BEFORE', index, component.id, component) : ''}
						<div key={component.id} className="">
							<component.component id={component.id} key={component.id} title={component.state} initState={component.state} change={handleChange} />
						</div>
						{(showDropZone) ? renderDropZones('AFTER', index, component.id, component) : ''}
					</div>
				</div>
			)
		});
	}

	/* ------------------------------- main render ------------------------------ */
	return (
		<div className="flex flex-col max-w-full w-full min-h-screen bg-white relative">
			{renderTopPanel()}
			<div className="overflow-y-auto" onDragEnd={(e) => dragEnd(e)}  >
				{(bloc_state.length === 0) ? renderBlocPlaceHolder() : renderComponents()}
			</div>
			<SearchableList display={display} list={cmp.Bloc_Components_Array} is_exist={bloc_path} callback={add_component} />
			<Prompt />
		</div>
	);
}

export default React.memo(BlockEditor);
