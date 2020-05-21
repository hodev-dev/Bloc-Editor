import React from 'react';
import ActionBar from '../ui/components/ActionBar';
import BlockEditor from '../ui/components/BlockEditor';
import Prompt from '../ui/components/Prompt';
import Files from '../ui/components/Files';
import Notification from '../ui/components/Notification';

const Editor = () => {
    return (
        <div className="flex justify-center min-h-screen">
            <ActionBar />
            {/* <Explorer/> */}
            <Files />
            <BlockEditor />
            <Notification />
        </div>
    );
}

export default Editor;
