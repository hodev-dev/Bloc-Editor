import React, { useState, useEffect } from 'react';
import ContextMenu from './ContextMenu';
import { useSelector, useDispatch } from 'react-redux';
import { getProjectFolderPath, selectProjectFolderPath, updateList, changeFolder } from '../actions/explorerAction';

const Explorer = () => {
	const dispatch = useDispatch();
	/* ------------------------------ global states ----------------------------- */
	let { initialExplorer } = useSelector((store: any) => store.explorerReducer);
	const { visible } = useSelector((store: any) => store.explorerReducer);
	const { projectPath } = useSelector((store: any) => store.explorerReducer);
	const { folderName } = useSelector((store: any) => store.explorerReducer);
	const { folderStack } = useSelector((store: any) => store.explorerReducer);
	/* ------------------------------- local state ------------------------------ */
	const [menu, setMenu] = useState(initialExplorer);
	const [clientPos, setClientPos] = useState<Array<number>>([0, 0]);
	const [switchContextMenu, setSwitchContextMenu] = useState(false);
	const [isProjectPathExists, setIsProjectPathExists] = useState(false);
	const [folderNameState, setFolderNameState] = useState(folderName)
	const [folderStackState, setFolderStackState] = useState(folderStack);

	/* --------------------------------- effects -------------------------------- */
	useEffect(() => {
		if (folderStackState.length === 0) {
			setMenu(initialExplorer);
		} else {
			setMenu([{ title: 'Back', type: "F", sub: [] }, ...initialExplorer]);
		}
	}, [initialExplorer]);

	useEffect(() => {
		if (!projectPath) {
			dispatch(getProjectFolderPath());
		}
		if (projectPath !== undefined && projectPath !== '') {
			setIsProjectPathExists(true);
		}
		if (folderName === '') {
			const normalizedPath = projectPath.substring(1, projectPath.length - 1);
			dispatch(updateList({ "projectPath": normalizedPath, "folderName": folderNameState, "fullPath": normalizedPath }));
		}
	}, [projectPath]);

	useEffect(() => {
		dispatch(changeFolder({ "projectPath": projectPath, "folderName": folderNameState, 'stackFolder': folderStackState }));
	}, [folderNameState, folderStackState]);

	/* -------------------------------- callbacks ------------------------------- */
	const handleClick = (item: any) => {
		onClickItemExplorer(item);
	}
	const setProjectFolderClick = () => {
		dispatch(selectProjectFolderPath());
	}
	const onClickItemExplorer = (item: any) => {
		if (item.title === 'Back') {
			folderStackState.pop();
			dispatch(changeFolder({ "projectPath": projectPath, "folderName": folderNameState, "stackFolder": folderStackState }));
		} else {
			if (projectPath !== '' && projectPath !== undefined && !item.title.includes('.')) {
				setFolderStackState((state: Array<string>) => {
					const lastitem = (state.length > 0) ? state.length - 1 : state.length;
					if (state[lastitem] !== item.title) {
						return [...state, item.title]
					}
					return [...state];
				});
				setFolderNameState(item.title);
			}
		}
	}
	/* --------------------------------- render --------------------------------- */
	const renderFoldersIcon = (item: any) => {
		if (item.sub.length > 0 && item.title !== 'Back' && item.title !== "Menu") {
			return (
				<svg className="w-5 h-5 fill-current hover:bg-pink-900 hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
					<path d="M0 4c0-1.1.9-2 2-2h7l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4z" />
				</svg>
			)
		} else if (item.title === 'Back') {
			return (
				<svg className="w-5 h-5 fill-current hover:bg-pink-900 hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
					<path d="M7.05 9.293L6.343 10 12 15.657l1.414-1.414L9.172 10l4.242-4.243L12 4.343z" />
				</svg>
			)
		} else if (item.title === '/') {
			return (
				<svg className="w-5 h-5 fill-current hover:bg-pink-900 hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
					<path d="M10.707 7.05L10 6.343 4.343 12l1.414 1.414L10 9.172l4.243 4.242L15.657 12z" />
				</svg>
			)
		} else {
			return (
				<svg className="w-5 h-5 fill-current hover:bg-pink-900 hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
					<path d="M0 4c0-1.1.9-2 2-2h7l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2 2v10h16V6H2z" />
				</svg>
			)
		}
	}

	const renderContextMenu = (e: any) => {
		e.preventDefault();
		setClientPos([e.pageX, e.pageY]);
		setSwitchContextMenu(true);
	}

	const renderList = (): any => {
		if (isProjectPathExists && menu !== undefined) {
			return menu.sort((a: any, b: any) => {
				if (b.title === "Back") return 0;
				if (b.type === "D") {
					return + 1;
				} else if (b.type === 'F') {
					return - 1;
				} else if (b.type === "D" && b.title > a.title) {
					return + 1;
				} else if (b.sub > 0) {
					return +1;
				}
				return 0;
			}).map((item: any, i: number) => (
				<div key={i} onClick={() => handleClick(item)} onContextMenu={(e) => renderContextMenu(e)} >
					<div key={i} className="flex cursor-pointer select-none">
						<div className={(i % 2 === 1) ? "flex w-full p-1 font-normal bg-gray-200 hover:bg-pink-900 hover:text-white" : "flex w-full p-1 font-normal bg-white hover:bg-pink-900 hover:text-white"}>
							{renderFoldersIcon(item)}
							<div className="ml-2 ">
								{item.title}
							</div>
						</div>
					</div>
				</div>
			));
		} else {
			return (
				<button className="btn bg-indigo-600 text-white p-1" onClick={() => setProjectFolderClick()}>Open Project Folder</button>
			)
		}
	}

	return (
		<div className={`${(visible) ? 'hidden' : 'w-64 bg-white self-stretch'}`}>
			<nav className="flex flex-wrap items-center justify-between p-2 mx-auto border">
				{/* ---------------------------------- left ---------------------------------- */}
				<div className="flex justify-start items-center mx-auto w-1/3 h-4">
					<h2 className="text-gray-700 text-sm font-semibold ">Explorer</h2>
				</div>
				{/* --------------------------------- center --------------------------------- */}
				<div className="flex justify-center items-center w-1/3  mx-auto">
				</div>
				{/* ---------------------------------- right --------------------------------- */}
				<div className="flex justify-end items-center mx-auto w-1/3 ">
					<svg onClick={() => 0} className="w-5 h-5 stroke-current mr-2 cursor-pointer" style={{ fill: "none", stroke: "#000", strokeLinecap: "round", strokeMiterlimit: 10, strokeWidth: 32 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M288,193s12.18-6-32-6a80,80,0,1,0,80,80" /><polyline points="256 149 296 189 256 229" /><path d="M256,64C150,64,64,150,64,256s86,192,192,192,192-86,192-192S362,64,256,64Z" /></svg>
					<svg onClick={() => 0} className="w-5 h-5 stroke-current mr-2 cursor-pointer" style={{ fill: "none", stroke: "#000", strokeLinecap: "round", strokeMiterlimit: 10, strokeWidth: 32 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M384,224V408a40,40,0,0,1-40,40H104a40,40,0,0,1-40-40V168a40,40,0,0,1,40-40H271.48" /><path d="M459.94,53.25a16.06,16.06,0,0,0-23.22-.56L424.35,65a8,8,0,0,0,0,11.31l11.34,11.32a8,8,0,0,0,11.34,0l12.06-12C465.19,69.54,465.76,59.62,459.94,53.25Z" /><path d="M399.34,90,218.82,270.2a9,9,0,0,0-2.31,3.93L208.16,299a3.91,3.91,0,0,0,4.86,4.86l24.85-8.35a9,9,0,0,0,3.93-2.31L422,112.66A9,9,0,0,0,422,100L412.05,90A9,9,0,0,0,399.34,90Z" /></svg>
					<svg onClick={() => 0} className="w-5 h-5 stroke-current mr-0 cursor-pointer" style={{ fill: "none", stroke: "#000", strokeLinecap: "round", strokeMiterlimit: 10, strokeWidth: 32 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M64,192V120a40,40,0,0,1,40-40h75.89a40,40,0,0,1,22.19,6.72l27.84,18.56A40,40,0,0,0,252.11,112H408a40,40,0,0,1,40,40v40" /><path d="M479.9,226.55,463.68,392a40,40,0,0,1-39.93,40H88.25a40,40,0,0,1-39.93-40L32.1,226.55A32,32,0,0,1,64,192h384.1A32,32,0,0,1,479.9,226.55Z" /></svg>
				</div>
			</nav>
			{/* ----------------------------- phone menu body ---------------------------- */}
			<div className="flex">
				<ul className="flex flex-col w-screen justify-center" >
					<ContextMenu pos={clientPos} toggle={switchContextMenu} />
					{renderList()}
				</ul>
			</div>
		</div>
	)
}

export default Explorer
