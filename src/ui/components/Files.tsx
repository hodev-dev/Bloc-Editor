import React, { useState, useEffect, useMemo, useCallback } from 'react';
import * as filesAction from '../../actions/filesAction';
import * as promptAction from '../../actions/promptAction';
import { useSelector, useDispatch } from 'react-redux';
import { IrootReducer } from '../../reducers/rootReducer';
import { Itheme } from '../../reducers/themeReducer';
import { load } from 'cheerio';
const Files = () => {

	/* ------------------------------ global state ------------------------------ */
	const dispatch = useDispatch();

	const { project_path } = useSelector((store: IrootReducer) => store.filesReducer);
	const { theme } = useSelector((store: IrootReducer) => store.themeReducer);
	const { loading } = useSelector((store: IrootReducer) => store.filesReducer);
	const { list } = useSelector((store: IrootReducer) => store.filesReducer);
	const { visible } = useSelector((store: IrootReducer) => store.filesReducer);
	const { folder_stack } = useSelector((store: IrootReducer) => store.filesReducer);
	const { is_changed } = useSelector((store: IrootReducer) => store.blocReducer);
	const { render_index } = useSelector((store: IrootReducer) => store.filesReducer);
	const { items_per_page } = useSelector((store: IrootReducer) => store.filesReducer);
	const { bloc_name } = useSelector((store: IrootReducer) => store.blocReducer);
	const { bloc_path } = useSelector((store: IrootReducer) => store.blocReducer);
	const { bloc_state } = useSelector((store: IrootReducer) => store.blocReducer);
	const theme_generate = ' ' + theme.default.bg.name + ' ' + theme.default.border.name + ' ' + theme.default.text.name;
	/* ------------------------------- local state ------------------------------ */
	useEffect(() => {
		// request project fodler path
		dispatch(filesAction.request_path());
		// listen to toggle command
		dispatch(filesAction.listenToggleDisplay());
		// listen to new lists
		dispatch(filesAction.get_list());
		return () => {
			filesAction.unsubscribe();
		};
	}, []);

	useEffect(() => {
		console.log(theme);
	}, [theme])

	useEffect(() => {
		// updates redux project path
		dispatch(filesAction.get_path());
		if (project_path === '' && loading === false) {
			// select project path from dialog
			dispatch(filesAction.select_path());
		}
		return () => {
			filesAction.unsubscribe();
		};
	}, [loading, project_path]);

	useEffect(() => {
		if (!loading) {
			// after change folder stack makes new path and request list with new path
			dispatch(filesAction.go_to_folder_stack());
		}
	}, [project_path, folder_stack])

	/* --------------------------------- events --------------------------------- */
	const click_on_list_item = (item: any) => {
		// updates folder stack with adding item to it
		if (item.type === "F") {
			//its file
			if (is_changed) {
				// if file changed save file first then switch to other file
				dispatch(filesAction.save_file(bloc_path, bloc_state));
				dispatch(filesAction.togge_is_changed(false));
				dispatch(filesAction.read_file(item));
			} else {
				dispatch(filesAction.read_file(item));
			}
		} else {
			// its dir
			dispatch(filesAction.add_to_folder_stack(item.title));
		}
	}

	const click_on_back = () => {
		dispatch(filesAction.pop_folder_stack());
	}

	const click_new_folder = () => {
		dispatch(promptAction.set_select('crf'));
	}
	const click_new_bloc = () => {
		dispatch(promptAction.set_select('crb'));
	}

	/* --------------------------------- render --------------------------------- */
	const renderBack = useCallback(() => {
		if (folder_stack.length > 0) {
			return (
				<button onClick={() => click_on_back()} className={"flex w-full p-2 text-gray-700 bg-gray-100 border cursor-pointer hover:bg-pink-900 hover:text-white" + theme_generate}>
					<svg className="w-5 h-5 mt-0 mr-2 cursor-pointer fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z" /></svg>
					<div className="text-sm font-bold text-left">back</div>
				</button>
			)
		}
	}, [folder_stack])

	const render_list_icon = (item: any) => {
		if (item.type === "D") {
			return (
				<svg className="w-5 h-5 mt-0 mr-2 cursor-pointer fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title>ionicons-v5-n</title><path d="M16.08,189.4,44.66,423.27A28,28,0,0,0,72.52,448h367a28,28,0,0,0,27.86-24.73L495.92,189.4A12,12,0,0,0,484,176H28A12,12,0,0,0,16.08,189.4Z" /><path d="M464,124a28,28,0,0,0-28-28H244.84l-48-32H76A28,28,0,0,0,48,92v52H464Z" /></svg>
			)
		} else {
			return (
				<svg className="w-5 h-5 mt-0 mr-2 cursor-pointer fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M312 155h91c2.8 0 5-2.2 5-5 0-8.9-3.9-17.3-10.7-22.9L321 63.5c-5.8-4.8-13-7.4-20.6-7.4-4.1 0-7.4 3.3-7.4 7.4V136c0 10.5 8.5 19 19 19z" /><path d="M267 136V56H136c-17.6 0-32 14.4-32 32v336c0 17.6 14.4 32 32 32h240c17.6 0 32-14.4 32-32V181h-96c-24.8 0-45-20.2-45-45z" /></svg>
			)
		}
	}

	const renderList = useCallback(() => {

		const sort = (a: any, b: any) => {
			if (b.type === "F") {
				return -1;
			}
			return 0;
		};
		if (!loading && list.length > 0) {
			list.sort(sort);
			return list.map((item: any, index: number) => {
				return (
					<div key={index} className="b">
						<button onClick={() => click_on_list_item(item)} className={"flex w-full p-2 text-sm font-bold text-left border cursor-pointer hover:bg-pink-900 hover:text-white" + theme_generate}>
							{render_list_icon(item)}
							{item.title}
						</button>
					</div>
				)
			});
		}
	}, [list, theme])

	/* ------------------------------- main render ------------------------------ */
	return (
		<div className={(visible) ? "relative max-h-screen overflow-auto self-stretch w-2/12 bg-gray-100" + theme_generate : 'hidden'}>
			<nav className={"sticky top-0 flex flex-wrap items-center justify-between p-2 mx-auto scrolling-touch " + theme_generate}>
				{/* ---------------------------------- left ---------------------------------- */}
				<div className="flex items-center justify-start w-1/3 h-4 mx-auto">
					<h2 className="text-sm font-semibold text-gray-700 ">Explorer</h2>
				</div>
				{/* --------------------------------- center --------------------------------- */}
				<div className="flex items-center justify-center w-1/3 mx-auto">
				</div>
				{/* ---------------------------------- right --------------------------------- */}
				<div className="flex items-center justify-end w-1/3 mx-auto ">
					<svg style={{ fill: "none", stroke: theme.default.editor_foreground, strokeLinecap: "round", strokeMiterlimit: 10, strokeWidth: 32 }} onClick={() => click_new_bloc()} className="w-5 h-5 mr-2 cursor-pointer stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M312 155h91c2.8 0 5-2.2 5-5 0-8.9-3.9-17.3-10.7-22.9L321 63.5c-5.8-4.8-13-7.4-20.6-7.4-4.1 0-7.4 3.3-7.4 7.4V136c0 10.5 8.5 19 19 19z" /><path d="M267 136V56H136c-17.6 0-32 14.4-32 32v336c0 17.6 14.4 32 32 32h240c17.6 0 32-14.4 32-32V181h-96c-24.8 0-45-20.2-45-45z" /></svg>
					<svg style={{ fill: "none", stroke: theme.default.editor_foreground, strokeLinecap: "round", strokeMiterlimit: 10, strokeWidth: 32 }} onClick={() => click_new_folder()} className="w-5 h-5 mr-0 cursor-pointer stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M64,192V120a40,40,0,0,1,40-40h75.89a40,40,0,0,1,22.19,6.72l27.84,18.56A40,40,0,0,0,252.11,112H408a40,40,0,0,1,40,40v40" /><path d="M479.9,226.55,463.68,392a40,40,0,0,1-39.93,40H88.25a40,40,0,0,1-39.93-40L32.1,226.55A32,32,0,0,1,64,192h384.1A32,32,0,0,1,479.9,226.55Z" /></svg>
				</div>
			</nav>
			{/* ----------------------------- phone menu body ---------------------------- */}
			<div className="flex flex-col">
				<div className="flex flex-col justify-center w-full">
					{renderBack()}
				</div>
				<ul className="flex flex-col justify-center w-full" >
					<div>
						{renderList()}
					</div>
				</ul>
			</div>
		</div>
	)
}


export default React.memo(Files);


