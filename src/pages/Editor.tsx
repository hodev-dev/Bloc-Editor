import React from 'react';
import ActionBar from '../ui/components/ActionBar';
import BlockEditor from '../ui/components/BlockEditor';
import Prompt from '../ui/components/Prompt';
import Files from '../ui/components/Files';

const Editor = () => {
    return (
        <div className="flex justify-center min-h-screen">
            <ActionBar />
            {/* <Explorer/> */}
            <Files />
            <BlockEditor />
            <Prompt />
        </div>
    );
}

export default Editor;
