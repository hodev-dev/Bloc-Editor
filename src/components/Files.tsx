import React, { useState, useEffect } from 'react';
import * as filesAction from '../actions/filesAction';
import { useSelector, useDispatch } from 'react-redux';

const Files = () => {
	/* ------------------------------ global state ------------------------------ */
	const { project_path } = useSelector((store: any) => store.filesReducer);
	const { loading } = useSelector((store: any) => store.filesReducer);
	const { list } = useSelector((store: any) => store.filesReducer);
	const { folder_stack } = useSelector((store: any) => store.filesReducer);
	const dispatch = useDispatch();

	/* ------------------------------- local state ------------------------------ */
	useEffect(() => {
		// request project fodler path
		dispatch(filesAction.request_path());
		// listen to new lists
		dispatch(filesAction.get_list());
		return () => {
			filesAction.unsubscribe();
		};
	}, []);

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
		filesAction.list_all_listener();
		if (project_path !== '') {
			// after change folder stack makes new path and request list with new path
			dispatch(filesAction.go_to_folder_stack());
		}
	}, [project_path, folder_stack])

	/* --------------------------------- events --------------------------------- */
	const click_on_list_item = (item: any) => {
		// updates folder stack with adding item to it
		dispatch(filesAction.add_to_folder_stack(item.title));
	}
	const click_on_back = () => {
		dispatch(filesAction.pop_folder_stack());
	}
	/* --------------------------------- render --------------------------------- */
	const renderBack = () => {
		if (loading === false && folder_stack.length > 0) {
			return (
				<div className="">
					<button onClick={() => click_on_back()} className="flex w-full p-2 bg-white cursor-pointer border text-gray-700 hover:bg-pink-900 hover:text-white">
						<svg className="w-5 h-5 fill-current mr-2 mt-0 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z" /></svg>
						<div className="font-bold text-sm text-left">
							back
						</div>
					</button>
				</div>
			)
		} else {
			return (
				<div></div >
			)
		}
	}
	const render_list_icon = (item: any) => {
		if (item.type === "D") {
			return (
				<svg className="w-5 h-5 fill-current mr-2 mt-0 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title>ionicons-v5-n</title><path d="M16.08,189.4,44.66,423.27A28,28,0,0,0,72.52,448h367a28,28,0,0,0,27.86-24.73L495.92,189.4A12,12,0,0,0,484,176H28A12,12,0,0,0,16.08,189.4Z" /><path d="M464,124a28,28,0,0,0-28-28H244.84l-48-32H76A28,28,0,0,0,48,92v52H464Z" /></svg>
			)
		} else {
			return (
				<svg className="w-5 h-5 fill-current mr-2 mt-0 cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M312 155h91c2.8 0 5-2.2 5-5 0-8.9-3.9-17.3-10.7-22.9L321 63.5c-5.8-4.8-13-7.4-20.6-7.4-4.1 0-7.4 3.3-7.4 7.4V136c0 10.5 8.5 19 19 19z" /><path d="M267 136V56H136c-17.6 0-32 14.4-32 32v336c0 17.6 14.4 32 32 32h240c17.6 0 32-14.4 32-32V181h-96c-24.8 0-45-20.2-45-45z" /></svg>
			)
		}
	}

	const renderList = () => {
		if (loading) {
			return (
				<div>loading</div>
			)
		} else {
			return list.map((item: any, index: number) => {
				return (
					<div key={index} className="">
						<button onClick={() => click_on_list_item(item)} className="flex w-full p-2 bg-white cursor-pointer border text-gray-700 font-bold text-sm text-left hover:bg-pink-900 hover:text-white">
							{render_list_icon(item)}
							{item.title}
						</button>
					</div>
				)
			});
		}
	}
	/* ------------------------------- main render ------------------------------ */
	return (
		<div className="w-64 bg-white self-stretch">
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
					<div>
						{renderBack()}
					</div>
					<div>
						{renderList()}
					</div>
				</ul>
			</div>
		</div>
	)
}

export default React.memo(Files);
