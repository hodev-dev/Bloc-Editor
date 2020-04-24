import React, { useState, useEffect } from 'react';
import ContextMenu from './ContextMenu';

const Explorer = (props: any) => {
	const { initMenu } = props;
	const { setProjectFolderClick } = props;
	const { visible } = props;
	const { isProjectPathExists } = props;
	const { onClickItemExplorer } = props;
	const {folderStack } = props;
	const [menu, setMenu] = useState(initMenu);
	const [clientPos, setClientPos] = useState<Array<number>>([0, 0]);
	const [switchContextMenu, setSwitchContextMenu] = useState(false);

	useEffect(() => {
		if (folderStack.length === 0) {
			setMenu(initMenu);
		} else {
			setMenu([{ title: 'Back', type: "F", sub: [] }, ...initMenu]);
		}
	}, [initMenu]);

	const handleClick = (item: any) => {
		onClickItemExplorer(item);
	}
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
			<nav className="flex flex-wrap items-center justify-between p-2 mx-auto">
				{/* ---------------------------------- left ---------------------------------- */}
				<div className="flex justify-start items-center mx-auto w-1/3 h-4">
					<h2 className="text-gray-700 text-sm font-semibold ">Explorer</h2>
				</div>
				{/* --------------------------------- center --------------------------------- */}
				<div className="flex justify-center items-center w-1/3  mx-auto">
				</div>
				{/* ---------------------------------- right --------------------------------- */}
				<div className="flex justify-end items-center mx-auto w-1/3">
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
