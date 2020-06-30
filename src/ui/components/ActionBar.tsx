import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const ActionBar = () => {
    const dispatch = useDispatch();

    return (
        <div className="flex flex-col w-16 max-h-full bg-white text-gray-900 p-4 border items-stretch justify-start">
            <div className="self-start flex-1 sticky">
                <Link to="/">
                    <svg className="w-8 h-8 fill-current text-gray-900 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M0 4c0-1.1.9-2 2-2h7l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4z" />
                    </svg>
                </Link>
                <Link to="/search">
                    <svg className="w-8 h-8 fill-current text-gray-900 mt-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
                    </svg>
                </Link>
                <svg className="w-8 h-8 fill-current text-gray-900 mt-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M17 12h-6v4h1v4H8v-4h1v-4H3v4h1v4H0v-4h1v-4a2 2 0 0 1 2-2h6V6H7V0h6v6h-2v4h6a2 2 0 0 1 2 2v4h1v4h-4v-4h1v-4z" />
                </svg>
                <svg className="w-8 h-8 fill-current text-gray-900 mt-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z" />
                </svg>
                <svg className="w-8 h-8 fill-current text-gray-900 mt-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M18 9.87V20H2V9.87a4.25 4.25 0 0 0 3-.38V14h10V9.5a4.26 4.26 0 0 0 3 .37zM3 0h4l-.67 6.03A3.43 3.43 0 0 1 3 9C1.34 9 .42 7.73.95 6.15L3 0zm5 0h4l.7 6.3c.17 1.5-.91 2.7-2.42 2.7h-.56A2.38 2.38 0 0 1 7.3 6.3L8 0zm5 0h4l2.05 6.15C19.58 7.73 18.65 9 17 9a3.42 3.42 0 0 1-3.33-2.97L13 0z" />
                </svg>
                <svg className="w-8 h-8 fill-current text-gray-900 mt-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M10 1l10 6-10 6L0 7l10-6zm6.67 10L20 13l-10 6-10-6 3.33-2L10 15l6.67-4z" />
                </svg>
                <svg className="w-8 h-8 fill-current text-gray-900 mt-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M6 4H5a1 1 0 1 1 0-2h11V1a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V5a1 1 0 0 0-1-1h-7v8l-2-2-2 2V4z" />
                </svg>
                <svg className="w-8 h-8 fill-current text-gray-900 mt-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M7 13.33a7 7 0 1 1 6 0V16H7v-2.67zM7 17h6v1.5c0 .83-.67 1.5-1.5 1.5h-3A1.5 1.5 0 0 1 7 18.5V17zm2-5.1V14h2v-2.1a5 5 0 1 0-2 0z" />
                </svg>
                <svg className="w-8 h-8 fill-current text-gray-900 mt-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M0 10V2l2-2h8l10 10-10 10L0 10zm4.5-4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
                </svg>
            </div>
            <div className="self-end">
                <svg className="w-8 h-8 fill-current text-gray-900 mt-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1z" />
                </svg>
                <svg className="w-8 h-8 fill-current text-gray-900 mt-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M3.94 6.5L2.22 3.64l1.42-1.42L6.5 3.94c.52-.3 1.1-.54 1.7-.7L9 0h2l.8 3.24c.6.16 1.18.4 1.7.7l2.86-1.72 1.42 1.42-1.72 2.86c.3.52.54 1.1.7 1.7L20 9v2l-3.24.8c-.16.6-.4 1.18-.7 1.7l1.72 2.86-1.42 1.42-2.86-1.72c-.52.3-1.1.54-1.7.7L11 20H9l-.8-3.24c-.6-.16-1.18-.4-1.7-.7l-2.86 1.72-1.42-1.42 1.72-2.86c-.3-.52-.54-1.1-.7-1.7L0 11V9l3.24-.8c.16-.6.4-1.18.7-1.7zM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                </svg>
            </div>
        </div>
    );
}

export default React.memo(ActionBar);
