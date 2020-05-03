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
		dispatch(filesAction.request_path());
		dispatch(filesAction.get_list());
		return () => {
			filesAction.unsubscribe();
		};
	}, []);

	useEffect(() => {
		dispatch(filesAction.get_path());
		if (project_path === '' && loading === false) {
			dispatch(filesAction.select_path());
		}
		return () => {
			filesAction.unsubscribe();
		};
	}, [loading, project_path]);

	useEffect(() => {
		if (project_path !== '') {
			dispatch(filesAction.go_to_folder_stack());
		}
	}, [project_path, folder_stack])
	/* --------------------------------- events --------------------------------- */
	const click_on_list_item = (item: any) => {
		dispatch(filesAction.add_to_folder_stack(item));
	}
	/* --------------------------------- render --------------------------------- */
	const renderList = () => {
		if (loading) {
			return (
				<div>loading</div>
			)
		} else {
			return list.map((item: any, index: number) => {
				return (
					<div key={index} className="">
						<button onClick={() => click_on_list_item(item)} className="w-full bg-white text-gray-700 text-left p-2 cursor-pointer border hover:bg-pink-900 hover:text-white">{item}</button>
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
					{renderList()}
				</ul>
			</div>
		</div>
	)
}

export default React.memo(Files);
