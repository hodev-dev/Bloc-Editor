import React, { useState, useEffect } from 'react';
import ActionBar from '../components/ActionBar';
import Explorer from '../components/Explorer';
import BlockEditor from '../components/BlockEditor';
import Prompt from '../components/Prompt';
import Files from '../components/Files';

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
