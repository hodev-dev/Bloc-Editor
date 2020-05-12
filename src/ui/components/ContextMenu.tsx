import React, { useState, useEffect, useRef } from 'react';

const ContextMenu = (props: any) => {
    const initItem = [
        { title: 'open', action: () => console.log('open') },
        { title: 'rename', action: () => console.log('rename') },
        { title: 'delete', action: () => console.log('delete') },
        { title: 'duplicate', action: () => console.log('duplicate') },
        { title: 'copy', action: () => console.log('copy') },
        { title: 'paste', action: () => console.log('paste') },
    ]
    let { pos, toggle } = props;
    const [items] = useState(initItem);
    const node = useRef<any | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (pos[0] !== 0) {
            setVisible(toggle);
        }
    }, [pos,toggle])

    useEffect(() => {
        if (visible) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [visible]);

    const handleClickOutside = (e: any) => {
        if (node.current.contains(e.target)) {
            return;
        }
        setVisible(false);
    };

    const renderItems = (): Array<JSX.Element> => {
        return items.map((item, index) => {
            return (
                <div key={index} onClick={() => item.action()} className="h-auto text-lg hover:bg-pink-900 hover:text-white p-1 cursor-pointer">
                    <div className="ml-3">
                        {item.title}
                    </div>
                </div>
            )
        });
    }
    
    return (
        <div id="contextMenu" style={{ top: pos[1], left: pos[0] }} className={`${(visible) ? 'absolute' : 'hidden'} w-64 h-64 max-h-screen bg-white shadow-xl z-50 top-0 bottom-0 border overflow-hidden`} ref={node} >
            {renderItems()}
        </div>
    );
}

export default ContextMenu;
