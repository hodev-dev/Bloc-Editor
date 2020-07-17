import React, { useState, useEffect } from 'react'
import * as FilesAction from '../actions/filesAction';
import { useDispatch, useSelector } from 'react-redux';
import { IrootReducer } from '../reducers/rootReducer';
import src from '*.bmp';
const ipcRenderer = window.require('electron').ipcRenderer;

const Image = (props: any) => {
    const { change, id, initState, lock } = props;
    const dispatch = useDispatch();
    const { project_path } = useSelector((store: IrootReducer) => store.filesReducer);
    const { last_file_imported } = useSelector((store: IrootReducer) => store.filesReducer);
    const [state, setState] = useState(initState);
    const [showControll, setShowControll] = useState(false);
    const { theme } = useSelector((store: IrootReducer) => store.themeReducer);
    const theme_generate = ' ' + theme.default.bg.name + ' ' + theme.default.border.name + ' ' + theme.default.text.name;

    useEffect(() => {
        change(id, state);
    }, [state])


    const handleClick = () => {
        ipcRenderer.send('files:import_media', project_path, id);
        ipcRenderer.on('files:import_media_path', (event: any, base64_image_data: string, _id: string) => {
            if (id === _id) {
                setState((prevState: any) => {
                    return { ...prevState, src: base64_image_data }
                });
            }
        });
    }
    const handleWidthinput = (e: any) => {
        e.persist();
        setState((prevState: any) => {
            return { ...prevState, width: Number(e.target.value) }
        });
    }

    const handleHeightInput = (e: any) => {
        e.persist();
        setState((prevState: any) => {
            return { ...prevState, height: Number(e.target.value) }
        });
    }

    const handleAlign = (align: string) => {
        setState((prevState: any) => {
            return { ...prevState, align: String(align) }
        });
    }
    const handleMosueEnter = () => {
        setShowControll(true);
    }
    const handleMouseLeave = () => {
        setShowControll(false);
    }
    const renderImagePlaceHolder = () => {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="729.47"
                height="695.09"
                data-name="Layer 1"
                viewBox="0 0 729.47 695.09"
            >
                <defs>
                    <linearGradient
                        id="fc2ce546-a06c-4acb-8cca-fc7989cc5e45"
                        x1="611.98"
                        x2="611.98"
                        y1="687.2"
                        y2="258.73"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="gray" stopOpacity="0.25"></stop>
                        <stop offset="0.54" stopColor="gray" stopOpacity="0.12"></stop>
                        <stop offset="1" stopColor="gray" stopOpacity="0.1"></stop>
                    </linearGradient>
                    <linearGradient
                        id="8de405ef-36e0-4554-af41-d0565e95cbca"
                        x1="410.91"
                        x2="452.61"
                        y1="358.56"
                        y2="86.08"
                        gradientTransform="matrix(1.01 .13 -.13 1.02 62.29 -41.05)"
                        xlinkHref="#fc2ce546-a06c-4acb-8cca-fc7989cc5e45"
                    ></linearGradient>
                    <linearGradient
                        id="90a47f5c-11a4-432e-bbe5-e819485e2974"
                        x1="597.01"
                        x2="597.01"
                        y1="453.03"
                        y2="138.64"
                        gradientTransform="rotate(20.42 597.09 295.9)"
                        xlinkHref="#fc2ce546-a06c-4acb-8cca-fc7989cc5e45"
                    ></linearGradient>
                    <linearGradient
                        id="c3d8783b-6f33-4c65-b7a9-7a0b4c25dfb1"
                        x1="756.62"
                        x2="772.25"
                        y1="488.3"
                        y2="249.01"
                        gradientTransform="matrix(.26 .99 -1.02 .25 910.43 -476.82)"
                        xlinkHref="#fc2ce546-a06c-4acb-8cca-fc7989cc5e45"
                    ></linearGradient>
                    <linearGradient
                        id="1441cd83-913d-413c-98d4-824021df009a"
                        x1="310"
                        x2="310"
                        y1="695.09"
                        y2="203.86"
                        xlinkHref="#fc2ce546-a06c-4acb-8cca-fc7989cc5e45"
                    ></linearGradient>
                    <linearGradient
                        id="4913d3bc-5f66-46f4-9c65-3645c89ed5d3"
                        x1="545.79"
                        x2="545.79"
                        y1="695.81"
                        y2="464.64"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0" stopColor="#b3b3b3" stopOpacity="0.25"></stop>
                        <stop offset="0.54" stopColor="#b3b3b3" stopOpacity="0.1"></stop>
                        <stop offset="1" stopColor="#b3b3b3" stopOpacity="0.05"></stop>
                    </linearGradient>
                    <linearGradient
                        id="0cf8a40c-444c-472e-8722-d672ac4b1674"
                        x1="310.8"
                        x2="310.8"
                        y1="580.62"
                        y2="375.85"
                        xlinkHref="#4913d3bc-5f66-46f4-9c65-3645c89ed5d3"
                    ></linearGradient>
                    <clipPath
                        id="f4edd298-8257-4895-a91b-ae15b3b0d94f"
                        transform="translate(-235.26 -102.45)"
                    >
                        <rect
                            width="291.69"
                            height="194.01"
                            x="400.07"
                            y="483.3"
                            fill="#fff"
                            rx="8.85"
                            ry="8.85"
                        ></rect>
                    </clipPath>
                </defs>
                <path
                    fill="url(#fc2ce546-a06c-4acb-8cca-fc7989cc5e45)"
                    d="M618.97 687.2L513.53 687.2 513.53 258.73 710.42 258.73 618.97 687.2z"
                ></path>
                <path
                    fill="#f5f5f5"
                    d="M613.72 687.2L510.37 687.2 510.37 258.73 703.35 258.73 613.72 687.2z"
                ></path>
                <path
                    fill="url(#8de405ef-36e0-4554-af41-d0565e95cbca)"
                    d="M249.88 158.45H689.0699999999999V327.29999999999995H249.88z"
                    transform="rotate(-15.62 -21.728 1049.253)"
                ></path>
                <path
                    fill="#f4f4f4"
                    d="M254.32 160.66H686.1700000000001V324.1H254.32z"
                    transform="rotate(-15.62 -20.95 1048.728)"
                ></path>
                <path
                    fill="#f5f5f5"
                    d="M367.9 230.63H476.54999999999995V238.92H367.9z"
                    transform="rotate(-15.62 -68.97 1041.139)"
                ></path>
                <path
                    fill="#fff"
                    d="M376.82 262.55H485.47V270.84000000000003H376.82z"
                    transform="rotate(-15.62 -60.05 1073.04)"
                ></path>
                <path
                    fill="#fff"
                    d="M371.14 237.71H545.74V246H371.14z"
                    transform="rotate(-15.62 -32.765 1048.221)"
                ></path>
                <circle
                    cx="329.58"
                    cy="277.88"
                    r="19.34"
                    fill="#fff"
                    transform="rotate(-15.62 -161.6 1084.217)"
                ></circle>
                <path
                    fill="url(#90a47f5c-11a4-432e-bbe5-e819485e2974)"
                    d="M376.38 210.25H817.64V381.41999999999996H376.38z"
                    transform="rotate(-20.42 195.057 897.759)"
                ></path>
                <path
                    fill="#f7f7f7"
                    d="M381.03 214.81H812.88V378.25H381.03z"
                    transform="rotate(-20.42 195.02 898.44)"
                ></path>
                <path
                    fill="#f5f5f5"
                    d="M494.14 288.83H602.79V297.12H494.14z"
                    transform="rotate(-20.42 146.505 894.89)"
                ></path>
                <path
                    fill="#fff"
                    d="M505.71 319.89H614.36V328.18H505.71z"
                    transform="rotate(-20.42 158.079 925.951)"
                ></path>
                <path
                    fill="#fff"
                    d="M497.85 292.85H672.45V301.14000000000004H497.85z"
                    transform="matrix(.94 -.35 .35 .94 -302.12 120.41)"
                ></path>
                <circle
                    cx="459.76"
                    cy="343.69"
                    r="19.34"
                    fill="#fff"
                    transform="rotate(-20.42 57.805 945.61)"
                ></circle>
                <path
                    fill="url(#c3d8783b-6f33-4c65-b7a9-7a0b4c25dfb1)"
                    d="M646.89 150.88H819.06V591.02H646.89z"
                    transform="rotate(-79.9 554.185 460.16)"
                ></path>
                <path
                    fill="#fafafa"
                    d="M515.81 288.22H947.66V451.66H515.81z"
                    transform="rotate(10.1 1193.786 -1012.45)"
                ></path>
                <path
                    fill="#f5f5f5"
                    d="M687.63 287.92H695.92V396.57000000000005H687.63z"
                    transform="rotate(-79.9 512.984 431.46)"
                ></path>
                <path
                    fill="#fff"
                    d="M681.81 320.56H690.0999999999999V429.21000000000004H681.81z"
                    transform="rotate(-79.9 507.173 464.093)"
                ></path>
                <path
                    fill="#fff"
                    d="M717.18 277.05H725.4699999999999V451.65H717.18z"
                    transform="rotate(-79.9 542.536 453.562)"
                ></path>
                <circle
                    cx="589.6"
                    cy="340.88"
                    r="19.34"
                    fill="#fff"
                    transform="rotate(-79.9 410.809 430.091)"
                ></circle>
                <path
                    fill="url(#1441cd83-913d-413c-98d4-824021df009a)"
                    d="M171.78 253.69L100.61 203.86 2.07 203.86 2.07 253.69 2.07 278.1 2.07 695.09 617.93 695.09 617.93 253.69 171.78 253.69z"
                ></path>
                <path
                    fill="#fff"
                    d="M174.44 258.73L104.36 210.36 7.34 210.36 7.34 258.73 7.34 282.43 7.34 687.2 613.72 687.2 613.72 258.73 174.44 258.73z"
                ></path>
                <path
                    fill="url(#4913d3bc-5f66-46f4-9c65-3645c89ed5d3)"
                    d="M711.54 688.53a7.25 7.25 0 01-7.21 7.28H387.26a7.25 7.25 0 01-7.21-7.28v-216.6a7.25 7.25 0 017.21-7.28h317.07a7.25 7.25 0 017.21 7.28"
                    transform="translate(-235.26 -102.45)"
                ></path>
                <path
                    fill="#fff"
                    d="M707.81 685a7 7 0 01-7 7H391.05a7 7 0 01-7-7V475.62a7 7 0 017-7h309.72a7 7 0 017 7"
                    transform="translate(-235.26 -102.45)"
                ></path>
                <rect
                    width="299.37"
                    height="204.76"
                    x="161.12"
                    y="375.85"
                    fill="url(#0cf8a40c-444c-472e-8722-d672ac4b1674)"
                    data-name="&lt;Rectangle&gt;"
                    rx="8.85"
                    ry="8.85"
                ></rect>
                <rect
                    width="291.69"
                    height="194.01"
                    x="164.8"
                    y="380.84"
                    fill="#000"
                    rx="8.85"
                    ry="8.85"
                ></rect>
                <g clip-path="url(#f4edd298-8257-4895-a91b-ae15b3b0d94f)">
                    <path
                        fill="#6c63ff"
                        d="M383.84 675.53l81.44-93.31a16.21 16.21 0 0122.94-1.5L511 600.84a16.21 16.21 0 0021.16.25l69.7-58.58A16.21 16.21 0 01624.3 544l85.53 94.14a16.21 16.21 0 014.15 9.47l3.3 37.13a16.21 16.21 0 01-16.15 17.65H396.06a16.21 16.21 0 01-16.2-15.72 16.21 16.21 0 013.98-11.14z"
                        transform="translate(-235.26 -102.45)"
                    ></path>
                </g>
                <circle cx="199.93" cy="411.95" r="18.06" fill="#ff5252"></circle>
            </svg>
        );
    }
    return (
        <div className={"relative flex flex-col w-full h-full min-h-screen bg-white" + theme_generate} style={{ alignItems: (state.align) ? state.align : 'center' }} onMouseOver={handleMosueEnter} onMouseLeave={handleMouseLeave} onClick={handleMosueEnter}>
            <div className={(!lock) ? "sticky top-0 left-0 text-black bg-white w-full border" + theme_generate : "hidden border-none"} >
                <div className={"sticky top-0 z-40 w-full bg-white border border-t-0 border-b-0" + theme_generate}>
                    <button onClick={() => handleClick()} className={"w-32 h-10 border" + theme_generate}>Set Image</button>
                    <input onChange={handleWidthinput} placeholder="Enter Width" type="text" className={"w-32 h-10 p-2" + theme_generate} />
                    <input onChange={handleHeightInput} placeholder="Enter Height" type="text" className={"w-32 h-10 p-2" + theme_generate} />
                    <button onClick={() => handleAlign('flex-start')} className={"w-32 h-10 border" + theme_generate}>Right</button>
                    <button onClick={() => handleAlign('center')} className={"w-32 h-10 border" + theme_generate}>Center</button>
                    <button onClick={() => handleAlign('flex-end')} className={"w-32 h-10 border" + theme_generate}>Left</button>
                </div>
            </div>
            <div className={(state.src) ? "hidden" : "flex items-center justify-center w-3/6 min-h-64 p-5 opacity-75"}>
                {renderImagePlaceHolder()}
            </div>
            <img loading="lazy" className={(state.src) ? "rounded-lg" : 'hidden'} style={{ width: state.width + 'vw', height: state.height + 'vh', }} src={"data:image/png;base64," + state.src} alt="image doesnt exist" />
        </div >
    )
}

export default Image
